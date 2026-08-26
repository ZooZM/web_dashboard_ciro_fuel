import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Skeleton } from './skeleton';
import { useMemo } from 'react';

interface CustomGoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string; icon?: string }>;
  className?: string;
  onLoad?: (map: google.maps.Map) => void;
  options?: google.maps.MapOptions;
}

export function CustomGoogleMap({ 
  center, 
  zoom = 13, 
  markers = [], 
  className = '',
  onLoad,
  options
}: CustomGoogleMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '100%'
  }), []);

  if (!isLoaded) {
    return <Skeleton className={`w-full h-full ${className}`} />;
  }

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          ...options,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            icon={marker.icon}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
