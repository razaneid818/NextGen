/**
 * Daily.co room provisioning — called exactly once, by the admin activation
 * action, never earlier. A room only exists once a booking is paid AND an
 * admin has activated it, so there is no code path where a room URL exists
 * before both conditions are met.
 */

interface CreateRoomResult {
  roomName: string;
  roomUrl: string;
}

export async function createDailyRoom(bookingId: string): Promise<CreateRoomResult> {
  const apiKey = process.env.DAILY_API_KEY;
  const domain = process.env.DAILY_DOMAIN;

  if (!apiKey || !domain) {
    // Development fallback so activation can be tested without a Daily.co account yet.
    const roomName = `mock-room-${bookingId}`;
    return { roomName, roomUrl: `https://example.daily.co/${roomName}` };
  }

  const res = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `booking-${bookingId}`,
      properties: {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // expires 2h after creation
        enable_chat: true,
        max_participants: 2, // 1-on-1 only
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Daily.co room creation failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { roomName: data.name, roomUrl: data.url };
}
