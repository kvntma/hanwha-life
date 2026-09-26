export interface DeliveryWindow {
  id: string;
  label: string;
  timeSlot: string;
  cutoff: string;
  description: string;
  isGtaLocal: boolean;
}

export const GTA_DELIVERY_WINDOWS: DeliveryWindow[] = [
  {
    id: 'gta-same-day-evening',
    label: 'GTA Same-Day Evening Drop (6:00 PM – 9:30 PM)',
    timeSlot: '6:00 PM – 9:30 PM',
    cutoff: 'Order before 2:00 PM EST for same-day dispatch',
    description: 'Direct courier hand-off or discreet porch/concierge drop across the GTA.',
    isGtaLocal: true,
  },
  {
    id: 'gta-next-day-morning',
    label: 'GTA Next-Day Morning Drop (9:00 AM – 12:30 PM)',
    timeSlot: '9:00 AM – 12:30 PM',
    cutoff: 'Order before 8:00 PM EST for next-morning delivery',
    description: 'Early laboratory supply drop across Toronto, Peel, and York regions.',
    isGtaLocal: true,
  },
  {
    id: 'gta-afternoon',
    label: 'GTA Standard Afternoon Drop (1:00 PM – 4:30 PM)',
    timeSlot: '1:00 PM – 4:30 PM',
    cutoff: 'Scheduled weekday afternoon delivery slot',
    description: 'Afternoon drop-off with SMS arrival alerts.',
    isGtaLocal: true,
  },
  {
    id: 'ontario-courier-express',
    label: 'Ontario Regional Tracked Courier (1–2 Business Days)',
    timeSlot: '1–2 Business Days',
    cutoff: 'Shipped daily via express insulated courier',
    description: 'Available for all locations in Ontario outside the immediate GTA coverage zone.',
    isGtaLocal: false,
  },
];

export const GTA_REGIONS = [
  {
    name: 'Toronto Core & Central',
    cities: ['Downtown Toronto', 'Midtown', 'North York', 'East York', 'Scarborough', 'Etobicoke'],
    postalPrefixes: ['M4', 'M5', 'M6', 'M1', 'M2', 'M3', 'M7', 'M8', 'M9'],
    status: 'Active Local Same-Day',
  },
  {
    name: 'Peel Region',
    cities: ['Mississauga', 'Brampton', 'Caledon'],
    postalPrefixes: ['L4T', 'L4W', 'L4X', 'L4Y', 'L4Z', 'L5A', 'L5B', 'L5C', 'L5E', 'L5G', 'L5H', 'L5J', 'L5K', 'L5L', 'L5M', 'L5N', 'L5R', 'L5V', 'L5W', 'L6P', 'L6R', 'L6S', 'L6T', 'L6U', 'L6V', 'L6W', 'L6X', 'L6Y', 'L6Z'],
    status: 'Active Local Same-Day',
  },
  {
    name: 'York Region',
    cities: ['Vaughan', 'Markham', 'Richmond Hill', 'Thornhill', 'Woodbridge'],
    postalPrefixes: ['L4H', 'L4J', 'L4K', 'L4L', 'L4S', 'L4B', 'L4C', 'L4E', 'L3P', 'L3R', 'L3S', 'L3T', 'L3X', 'L3Y', 'L6A', 'L6B', 'L6C', 'L6E'],
    status: 'Active Local Same-Day',
  },
  {
    name: 'Halton Region',
    cities: ['Oakville', 'Burlington', 'Milton'],
    postalPrefixes: ['L6H', 'L6J', 'L6K', 'L6L', 'L6M', 'L7L', 'L7M', 'L7N', 'L7P', 'L7R', 'L7S', 'L7T', 'L9T'],
    status: 'Active Local Same-Day',
  },
  {
    name: 'Durham Region',
    cities: ['Pickering', 'Ajax', 'Whitby', 'Oshawa'],
    postalPrefixes: ['L1V', 'L1W', 'L1X', 'L1S', 'L1T', 'L1Z', 'L1M', 'L1N', 'L1P', 'L1R', 'L1G', 'L1H', 'L1J', 'L1K', 'L1L'],
    status: 'Active Local Drops',
  },
];

export const PAYMENT_CONFIG = {
  etransferEmail: 'payments@vialsupply.com',
  interacEnabled: true,
  autodeposit: true,
  fallbackQuestion: 'Order',
  fallbackAnswer: 'VialSupply',
  supportEmail: 'support@vialsupply.com',
  dispatchHours: 'Monday – Sunday: 8:00 AM – 10:00 PM EST',
  gtaHotline: '+1 (416) 555-VIAL (8425)',
};
