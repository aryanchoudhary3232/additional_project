import { NextResponse } from 'next/server';
import { INSTITUTION_INFO, TIME_SLOTS, DAYS, TIMETABLE_DATA } from '@/lib/timetableData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const freeOnly = searchParams.get('freeOnly') === 'true';
  const day = searchParams.get('day');

  let data = { ...TIMETABLE_DATA };

  if (day && DAYS.includes(day)) {
    data = { [day]: TIMETABLE_DATA[day] };
  }

  // Calculate free slot statistics
  let freeSlotsCount = 0;
  const freeSlotSummary = [];

  DAYS.forEach(d => {
    const daySchedule = TIMETABLE_DATA[d];
    if (daySchedule) {
      Object.keys(daySchedule).forEach(slotId => {
        if (daySchedule[slotId].isFree) {
          freeSlotsCount++;
          const slotMeta = TIME_SLOTS.find(ts => ts.id === Number(slotId));
          freeSlotSummary.push({
            day: d,
            slotId: Number(slotId),
            time: slotMeta ? slotMeta.time : 'Unknown Time',
            note: daySchedule[slotId].note || 'Free Slot'
          });
        }
      });
    }
  });

  return NextResponse.json({
    institution: INSTITUTION_INFO,
    timeSlots: TIME_SLOTS,
    days: DAYS,
    timetable: data,
    freeSlotsCount,
    freeSlotsList: freeSlotSummary
  });
}
