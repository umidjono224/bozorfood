import { supabase } from "@/integrations/supabase/client";

export async function checkPhoneExists(phone: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("registered_users")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error("Error checking phone:", error);
    return false;
  }

  return !!data;
}

export async function registerUser(phone: string, name?: string): Promise<{ success: boolean; error?: string }> {
  // Check if phone already exists
  const exists = await checkPhoneExists(phone);
  if (exists) {
    return { 
      success: false, 
      error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" 
    };
  }

  // Register the user
  const { error } = await supabase
    .from("registered_users")
    .insert({
      phone,
      name: name || null,
    });

  if (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      error: "Ro'yxatdan o'tishda xatolik yuz berdi" 
    };
  }

  return { success: true };
}
