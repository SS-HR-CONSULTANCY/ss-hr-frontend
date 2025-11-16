export const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: "", color: "" };

  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/\d/.test(password)) strength += 25;

  if (strength <= 25) return { strength, label: "Weak", color: "bg-red-500" };
  if (strength <= 50)
    return { strength, label: "Fair", color: "bg-yellow-500" };
  if (strength <= 75) return { strength, label: "Good", color: "bg-blue-500" };
  return { strength, label: "Strong", color: "bg-green-500" };
};
