import { supabase } from './supabaseClient';
import { accommodations as fallbackAccommodations } from '../data/accommodations';

export const getAccommodations = async () => {
    try {
        // If Supabase is not fully configured (missing URL or Key), return fallback immediately
        if (!supabase.supabaseUrl || !supabase.supabaseKey) { 
            console.log('Supabase credentials missing, using fallback data');
            return fallbackAccommodations;
        }

        const { data, error } = await supabase
            .from('accommodations')
            .select('*');
        
        if (error) {
            console.error('Error fetching accommodations:', error);
            console.log('Falling back to local data');
            return fallbackAccommodations;
        }

        if (!data || data.length === 0) {
             console.log('No data found in Supabase, falling back to local data');
             return fallbackAccommodations;
        }
        
        return data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            rating: item.rating,
            reviews: item.reviews,
            price: item.price,
            priceUnit: item.price_unit,
            description: item.description,
            address: item.address,
            phone: item.phone,
            website: item.website,
            position: item.position,
            images: item.images,
            amenities: item.amenities,
            maxGuests: item.max_guests,
            checkInTime: item.check_in_time,
            checkOutTime: item.check_out_time
        }));
    } catch (error) {
        console.error('Unexpected error fetching accommodations:', error);
        return fallbackAccommodations;
    }
};
