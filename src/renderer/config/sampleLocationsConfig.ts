
export interface SampleLocation {
  id: number;
  label: string;
  lat: number;
  long: number; // Adjust according to your needs
  isEnabled: boolean;
}


const sampleLocations: SampleLocation[] = [
  {
    id: 0,
    label: 'Nulligans Island',
    lat: 0,
    long: 0,
    isEnabled: true,
  },
  {
    id: 1,
    label: 'Location here',
    lat: 0,
    long: 0,
    isEnabled: true,
  }
]
