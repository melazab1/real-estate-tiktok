
export interface Job {
  id: string;
  job_id: string;
  user_id: string;
  property_url: string | null;
  status: string | null;
  current_step: number | null;
  created_at: string | null;
  updated_at: string | null;
  properties?: {
    title: string | null;
    location: string | null;
  }[];
  videos?: {
    video_url: string | null;
    thumbnail_url: string | null;
    status: string;
  }[];
}

export interface Property {
  id: string;
  job_id: string;
  title: string | null;
  description: string | null;
  price: number | null;
  location: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  additional_info: string | null;
  is_visible: Record<string, boolean> | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PropertyImage {
  id: string;
  job_id: string;
  image_url: string;
  sort_order: number | null;
  is_visible: boolean | null;
  uploaded_at: string | null;
}

export interface VideoScript {
  id: string;
  job_id: string;
  script_text: string | null;
  language: string | null;
  accent: string | null;
  voice_id: string | null;
  is_approved: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Video {
  id: string;
  job_id: string;
  video_url: string | null;
  thumbnail_url: string | null;
  status: string | null;
  duration: number | null;
  file_size: number | null;
  created_at: string | null;
  updated_at: string | null;
}
