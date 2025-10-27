// **** Time formating function for otp page **** \\
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

// **** Greeting generation function for header **** \\
export const greetings = (): string => {
  const date = new Date();
  const hour = date.getHours();
  if (hour >= 12 && hour <= 12) {
    return "Good Morning";
  } else if (hour > 12 && hour < 4) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

// **** Provider slot availability generator **** \\
const format12HourTime = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: string,
): string[] => {
  const slots: string[] = [];
  let currentTime = startTime;
  let interval = 0;

  if (intervalMinutes === "15 minutes") {
    interval = 15;
  } else if (intervalMinutes === "30 minutes") {
    interval = 30;
  } else if (intervalMinutes === "1 hour") {
    interval = 60;
  }

  while (currentTime <= endTime) {
    slots.push(format12HourTime(currentTime));
    const [hours, minutes] = currentTime.split(":").map(Number);
    const nextMinutes = minutes + interval;
    const nextHours = hours + Math.floor(nextMinutes / 60);
    const nextMinutesAdjusted = nextMinutes % 60;
    currentTime = `${String(nextHours).padStart(2, "0")}:${String(nextMinutesAdjusted).padStart(2, "0")}`;
  }
  return slots;
};

// **** Formate date for infoDisplayCompoenent **** \\
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

// **** Copy to clipboard function for infoDisplayCompoenent **** \\
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

// **** Formating function for boolean value formatBoolean **** \\
export const formatBoolean = (val: boolean) => (val ? "Yes" : "No");
