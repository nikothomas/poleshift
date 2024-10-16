import React, { useEffect, useRef, useContext } from 'react';
import Globe from 'react-globe.gl';
import useData from '../hooks/useData';
import useUI from '../hooks/useUI';
import globe from './world.200409.3x21600x10800.png';

const GlobeComponent: React.FC = () => {
  const globeRef = useRef<any>(null);
  const { samplingEventData, locations } = useData();
  const { setSelectedRightItem, isRightSidebarCollapsed, toggleRightSidebar } = useUI();

  // Extract the set of location IDs that have sampling events
  const locIdsWithSamplingEvents = new Set(
    Object.values(samplingEventData).map((event) => event.loc_id),
  );

  // Prepare data for plotting
  const pointsData = locations
    .filter(
      (loc) =>
        loc.lat != null &&
        loc.long != null &&
        locIdsWithSamplingEvents.has(loc.id),
    )
    .map((location) => ({
      lat: location.lat,
      lng: location.long,
      name: location.label,
      id: location.id,
    }));

  // Calculate average position for initial camera position
  const averagePosition = pointsData.reduce(
    (acc, point, _, { length }) => {
      acc.lat += point.lat / length;
      acc.lng += point.lng / length;
      return acc;
    },
    { lat: 0, lng: 0 },
  );

  // Use useEffect to set the camera position after the component has mounted
  useEffect(() => {
    if (globeRef.current && pointsData.length > 0) {
      globeRef.current.pointOfView(
        {
          lat: averagePosition.lat,
          lng: averagePosition.lng,
          altitude: 0.5,
        },
        0, // Duration in milliseconds (0 for immediate)
      );
    }
  }, [pointsData, averagePosition.lat, averagePosition.lng]);

  const handlePointClick = (point: any) => {
    const selectedLocation = locations.find((loc) => loc.id === point.id);
    if (selectedLocation) {
      setSelectedRightItem(selectedLocation);
      // Automatically expand the right sidebar if it's collapsed
      if (isRightSidebarCollapsed) {
        toggleRightSidebar();
      }
    }
  };

  return (
    <div className="globe-container">
      <Globe
        ref={globeRef}
        globeImageUrl={globe}
        pointsData={pointsData}
        onPointClick={handlePointClick}
        pointAltitude={0.1}
        pointRadius={0.05}
        pointColor={() => 'cyan'} // Bright color for contrast
        pointLabel="name"
        backgroundColor="#000000" // Dark background
        ambientLight={0.5} // Optional: Adjust ambient lighting
        directionalLight={1.0} // Optional: Adjust directional lighting
      />
    </div>
  );
};

export default GlobeComponent;
