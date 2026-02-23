import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MapPin, Save, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const DEFAULT_CENTER = {
  lat: Number(import.meta.env.VITE_MAP_CENTER_LAT || -25.41682188170712),
  lng: Number(import.meta.env.VITE_MAP_CENTER_LNG || 30.10243602023188),
};

function parseEwkbPoint(ewkb) {
  if (!ewkb || typeof ewkb !== 'string') return null;
  const hex = ewkb.startsWith('\\x') ? ewkb.slice(2) : ewkb;
  if (hex.length < 18 || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null;

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  const view = new DataView(bytes.buffer);
  const littleEndian = view.getUint8(0) === 1;
  const type = view.getUint32(1, littleEndian);
  const hasSrid = (type & 0x20000000) !== 0;
  const offset = hasSrid ? 9 : 5;

  if (view.byteLength < offset + 16) return null;

  const lng = view.getFloat64(offset, littleEndian);
  const lat = view.getFloat64(offset + 8, littleEndian);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return [lat, lng];
}

function formatCoord(value) {
  return Number(value).toFixed(6);
}

export default function BusinessLocationEditor({ business, onClose, onSaved }) {
  const initialCoords = useMemo(() => {
    const parsed = parseEwkbPoint(business?.location);
    return parsed || [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
  }, [business?.location]);

  const [lat, setLat] = useState(formatCoord(initialCoords[0]));
  const [lng, setLng] = useState(formatCoord(initialCoords[1]));
  const [leafletLoaded, setLeafletLoaded] = useState(
    () => typeof window !== 'undefined' && typeof window.L !== 'undefined'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    setLat(formatCoord(initialCoords[0]));
    setLng(formatCoord(initialCoords[1]));
  }, [initialCoords]);

  useEffect(() => {
    if (leafletLoaded) return;

    const loadLeaflet = async () => {
      try {
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(css);
        }

        if (!document.querySelector('script[src*="leaflet.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => setLeafletLoaded(true);
          document.body.appendChild(script);
        } else if (typeof window.L !== 'undefined') {
          setLeafletLoaded(true);
        }
      } catch {
        setError('Could not load map library.');
      }
    };

    void loadLeaflet();
  }, [leafletLoaded]);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current || !window.L) return;

    const latNum = Number(lat);
    const lngNum = Number(lng);
    const center = [
      Number.isFinite(latNum) ? latNum : DEFAULT_CENTER.lat,
      Number.isFinite(lngNum) ? lngNum : DEFAULT_CENTER.lng,
    ];

    const map = window.L.map(mapContainerRef.current, {
      center,
      zoom: 15,
      zoomControl: true,
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const marker = window.L.marker(center, { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      setLat(formatCoord(position.lat));
      setLng(formatCoord(position.lng));
    });

    map.on('click', (event) => {
      marker.setLatLng(event.latlng);
      setLat(formatCoord(event.latlng.lat));
      setLng(formatCoord(event.latlng.lng));
    });

    mapRef.current = map;
    markerRef.current = marker;
    setTimeout(() => map.invalidateSize(), 80);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, [leafletLoaded, lat, lng]);

  const moveMarker = () => {
    if (!markerRef.current || !mapRef.current) return;
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return;
    markerRef.current.setLatLng([latNum, lngNum]);
    mapRef.current.panTo([latNum, lngNum], { animate: true });
  };

  const handleSave = async () => {
    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      setError('Latitude and longitude must be valid numbers.');
      return;
    }
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setError('Coordinates are out of range.');
      return;
    }

    setSaving(true);
    setError('');

    const { error: saveError } = await supabase.rpc('set_business_location', {
      p_business_id: business.id,
      p_lat: latNum,
      p_lng: lngNum,
    });

    if (saveError) {
      setError(saveError.message || 'Could not save coordinates.');
      setSaving(false);
      return;
    }

    setSaving(false);
    if (onSaved) onSaved({ businessId: business.id, lat: latNum, lng: lngNum });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Pin Business Location</h3>
            <p className="text-sm text-gray-500">{business.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <div ref={mapContainerRef} className="w-full h-[360px] rounded-xl border border-gray-200 bg-gray-50" />
            <p className="mt-2 text-xs text-gray-500">
              Click on the map or drag the marker to set exact coordinates.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <MapPin size={16} />
                Coordinates
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    onBlur={moveMarker}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="-25.416821"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    onBlur={moveMarker}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="30.102436"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
