import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
  LogOut,
  Save,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import API_CONFIG from '../services/api/config';
import BusinessImageUpload from './BusinessImageUpload';

const INITIAL_AUTH_FORM = {
  email: '',
  password: '',
};

const INITIAL_PASSWORD_RESET_FORM = {
  password: '',
  confirmPassword: '',
};

function normalizeWebsiteUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function businessToDraft(business) {
  const social = business.social_links || {};
  return {
    name: business.name || '',
    description: business.description || '',
    address: business.address || '',
    phone: business.phone || '',
    website_url: business.website_url || '',
    facebook: social.facebook || '',
    instagram: social.instagram || '',
  };
}

function notifyBusinessesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('businesses:changed'));
  }
}

export default function BusinessOwnerPortal({ branding = null }) {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);
  const [passwordResetForm, setPasswordResetForm] = useState(INITIAL_PASSWORD_RESET_FORM);
  const [passwordResetBusy, setPasswordResetBusy] = useState(false);

  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM);
  const [authBusy, setAuthBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState('');
  const [ownedBusinesses, setOwnedBusinesses] = useState([]);
  const [claimableBusinesses, setClaimableBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const [draft, setDraft] = useState(null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const selectedBusiness = useMemo(
    () => ownedBusinesses.find((b) => b.id === selectedBusinessId) || null,
    [ownedBusinesses, selectedBusinessId]
  );

  const loadPortalData = useCallback(async (user) => {
    if (!user) return;

    setPortalLoading(true);
    setPortalError('');

    const ownedQuery = supabase
      .from('businesses')
      .select('id, name, slug, description, address, phone, email, website_url, social_links, images, tier, is_featured, updated_at')
      .eq('owner_id', user.id)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    const claimQuery = user.email
      ? supabase
          .from('businesses')
          .select('id, name, address, email, phone, tier, is_featured, images')
          .is('owner_id', null)
          .ilike('email', user.email)
          .order('name', { ascending: true })
      : Promise.resolve({ data: [], error: null });

    const [ownedResult, claimResult] = await Promise.all([ownedQuery, claimQuery]);

    if (ownedResult.error) {
      setPortalError(ownedResult.error.message);
      setPortalLoading(false);
      return;
    }

    if (claimResult.error) {
      setPortalError(claimResult.error.message);
      setPortalLoading(false);
      return;
    }

    const owned = ownedResult.data || [];
    const claimable = claimResult.data || [];

    setOwnedBusinesses(owned);
    setClaimableBusinesses(claimable);
    setSelectedBusinessId((prev) => {
      if (prev && owned.some((b) => b.id === prev)) return prev;
      return owned.length > 0 ? owned[0].id : null;
    });

    setPortalLoading(false);
  }, []);

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isActive) return;
      if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
        setPasswordRecoveryMode(true);
      }
      setSession(data.session ?? null);
      setSessionLoading(false);
    };

    bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!isActive) return;
      if (event === 'PASSWORD_RECOVERY') {
        setPasswordRecoveryMode(true);
        setAuthError('');
        setAuthMessage('Set a new password to finish recovery.');
      }
      if (event === 'SIGNED_OUT') {
        setPasswordRecoveryMode(false);
        setPasswordResetForm(INITIAL_PASSWORD_RESET_FORM);
      }
      setSession(nextSession);
      setSessionLoading(false);
    });

    return () => {
      isActive = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const user = session?.user ?? null;

    if (!user) {
      setOwnedBusinesses([]);
      setClaimableBusinesses([]);
      setSelectedBusinessId(null);
      setDraft(null);
      return;
    }
    void loadPortalData(user);
  }, [session?.user, loadPortalData]);

  useEffect(() => {
    if (!selectedBusiness) {
      setDraft(null);
      return;
    }
    setDraft(businessToDraft(selectedBusiness));
    setSaveMessage('');
  }, [selectedBusiness]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setAuthMessage('');
    setAuthBusy(true);

    const email = authForm.email.trim();
    const password = authForm.password;

    if (!email || !password) {
      setAuthError('Email and password are required.');
      setAuthBusy(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setAuthError(error.message || 'Authentication failed.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = authForm.email.trim().toLowerCase();
    if (!email) {
      setAuthError('Enter your email first, then click "Forgot password?".');
      return;
    }

    setAuthError('');
    setAuthMessage('');
    setResetBusy(true);

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || `HTTP ${response.status}`);
      }

      setAuthMessage(payload.message || 'If that email is registered, a reset email has been sent.');
    } catch (error) {
      setAuthError(error.message || 'Could not request password reset.');
    } finally {
      setResetBusy(false);
    }
  };

  const handlePasswordResetSubmit = async (event) => {
    event.preventDefault();
    const password = passwordResetForm.password;
    const confirmPassword = passwordResetForm.confirmPassword;

    if (!password || !confirmPassword) {
      setAuthError('Enter and confirm your new password.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthError('');
    setAuthMessage('');
    setPasswordResetBusy(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      }

      await supabase.auth.signOut();
      setPasswordRecoveryMode(false);
      setPasswordResetForm(INITIAL_PASSWORD_RESET_FORM);
      setAuthMessage('Password updated. Sign in with your new password.');
    } catch (error) {
      setAuthError(error.message || 'Could not update password.');
    } finally {
      setPasswordResetBusy(false);
    }
  };

  const handleSignOut = async () => {
    setPortalError('');
    setSaveMessage('');
    await supabase.auth.signOut();
  };

  const handleClaim = async (businessId) => {
    if (!session?.user?.email) {
      setPortalError('Your account email is missing.');
      return;
    }

    setPortalError('');
    setSaveMessage('');
    setPortalLoading(true);

    const { data, error } = await supabase
      .from('businesses')
      .update({
        owner_id: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', businessId)
      .is('owner_id', null)
      .ilike('email', session.user.email)
      .select('id, name, slug, description, address, phone, email, website_url, social_links, images, tier, is_featured, updated_at')
      .single();

    if (error) {
      setPortalError(error.message);
      setPortalLoading(false);
      return;
    }

    setOwnedBusinesses((prev) => [data, ...prev.filter((item) => item.id !== businessId)]);
    setClaimableBusinesses((prev) => prev.filter((item) => item.id !== businessId));
    setSelectedBusinessId(data.id);
    setSaveMessage('Business claimed successfully. You can now manage your listing.');
    notifyBusinessesChanged();
    setPortalLoading(false);
  };

  const handleSaveListing = async (event) => {
    event.preventDefault();
    if (!selectedBusiness || !session?.user) return;

    const name = draft?.name?.trim() || '';
    if (!name) {
      setPortalError('Business name is required.');
      return;
    }

    const socialLinks = {};
    if (draft.facebook.trim()) socialLinks.facebook = draft.facebook.trim();
    if (draft.instagram.trim()) socialLinks.instagram = draft.instagram.trim();

    setPortalError('');
    setSaveMessage('');
    setSaveBusy(true);

    const { data, error } = await supabase
      .from('businesses')
      .update({
        name,
        description: draft.description.trim() || null,
        address: draft.address.trim() || null,
        phone: draft.phone.trim() || null,
        website_url: normalizeWebsiteUrl(draft.website_url),
        social_links: socialLinks,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedBusiness.id)
      .eq('owner_id', session.user.id)
      .select('id, name, slug, description, address, phone, email, website_url, social_links, images, tier, is_featured, updated_at')
      .single();

    if (error) {
      setPortalError(error.message);
      setSaveBusy(false);
      return;
    }

    setOwnedBusinesses((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    setSaveMessage('Listing updated.');
    notifyBusinessesChanged();
    setSaveBusy(false);
  };

  if (sessionLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex items-center justify-center gap-3 text-gray-600">
          <Loader2 size={18} className="animate-spin" />
          <span>Loading account...</span>
        </div>
      </div>
    );
  }

  if (passwordRecoveryMode && session) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Set New Password</h2>
            <p className="text-sm text-gray-500">Create a new password for {session.user.email}</p>
          </div>

          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordResetForm.password}
                onChange={(e) => setPasswordResetForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordResetForm.confirmPassword}
                onChange={(e) => setPasswordResetForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Repeat your new password"
                required
              />
            </div>

            {authError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{authError}</div>
            )}

            <button
              type="submit"
              disabled={passwordResetBusy}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {passwordResetBusy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {passwordResetBusy ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#2f4a2f]/20 shadow-sm bg-white">
              <img
                src={branding?.logoUrl || '/branding/logo-square.svg'}
                alt={`${branding?.townName || 'Dullstroom'} ${branding?.appName || 'Digital'}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Client Portal</h2>
              <p className="text-sm text-gray-500">
                {(branding?.townName || 'Town')} business portal (invite-only access)
              </p>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@business.co.za"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your password"
                required
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetBusy}
                  className="text-xs md:text-sm font-semibold text-green-700 hover:text-green-800 disabled:opacity-60"
                >
                  {resetBusy ? 'Sending reset email...' : 'Forgot password?'}
                </button>
                <span className="text-xs text-gray-400">No open signup</span>
              </div>
            </div>

            {authError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{authError}</div>
            )}

            {authMessage && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl p-3">{authMessage}</div>
            )}

            <button
              type="submit"
              disabled={authBusy}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {authBusy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Business</h2>
          <p className="text-sm text-gray-500">Signed in as {session.user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {portalError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {portalError}
        </div>
      )}

      {saveMessage && (
        <div className="rounded-2xl border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          {saveMessage}
        </div>
      )}

      {portalLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-3 text-gray-600">
          <Loader2 size={18} className="animate-spin" />
          <span>Loading your businesses...</span>
        </div>
      )}

      {!portalLoading && ownedBusinesses.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Claim Your Listing</h3>
          {claimableBusinesses.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                We found listing{claimableBusinesses.length > 1 ? 's' : ''} matching your email. Claim your business to start managing details and images.
              </p>
              {claimableBusinesses.map((business) => (
                <div key={business.id} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{business.name}</p>
                    <p className="text-sm text-gray-500">{business.address || 'No address yet'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleClaim(business.id)}
                    className="inline-flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm font-semibold"
                  >
                    Claim Listing
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No unclaimed listing matched your email. Contact support to link your account to your listing.
            </p>
          )}
        </div>
      )}

      {!portalLoading && ownedBusinesses.length > 0 && selectedBusiness && draft && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
              <select
                value={selectedBusinessId || ''}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {ownedBusinesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your business"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={draft.address}
                    onChange={(e) => setDraft((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={draft.phone}
                    onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={draft.website_url}
                  onChange={(e) => setDraft((prev) => ({ ...prev, website_url: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://your-site.co.za"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="text"
                    value={draft.facebook}
                    onChange={(e) => setDraft((prev) => ({ ...prev, facebook: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={draft.instagram}
                    onChange={(e) => setDraft((prev) => ({ ...prev, instagram: e.target.value }))}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saveBusy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {saveBusy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Listing Images</h3>
            <BusinessImageUpload
              businessId={selectedBusiness.id}
              images={selectedBusiness.images || []}
              onImagesChange={(updatedImages) => {
                setOwnedBusinesses((prev) =>
                  prev.map((business) =>
                    business.id === selectedBusiness.id ? { ...business, images: updatedImages } : business
                  )
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
