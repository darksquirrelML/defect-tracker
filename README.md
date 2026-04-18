# 📸 Defect Tracker

A cloud-powered defect photo management app that works on any phone browser — no app store needed.

---

## ✨ Features

- 📄 Upload any Word defect format — auto-detects before/after photo layout
- ☁️ Cloud sync via Supabase — photos save instantly, accessible from any device
- 📱 Works on any phone browser — install as app via Add to Home Screen
- 👥 Multi-worker support — share a project code, multiple workers take photos simultaneously
- 📥 Generate Word report — after photos pasted into original format automatically
- 🗑 Delete photos or entire project — fully removes from cloud
- 🔄 Resume anytime — open project code to continue where you left off

---

## 🚀 How to Use

### Office (Computer)
1. Open the app URL in browser
2. Upload your `.docx` defect file
3. App reads all defects and before photos automatically
4. A **Project Code** is generated (e.g. `SADT-4821`)
5. Share the code with workers via WhatsApp

### Workers (Phone)
1. Open the app URL in phone browser
2. Enter the project code
3. All defects and before photos load from cloud
4. Tap **📷 Camera** or **📁 Gallery** to take after photos
5. Photos save to cloud instantly — can close and reopen anytime

### Office — Generate Report
1. Open app → enter project code
2. Click **🔄 Refresh** to load all workers' photos
3. Click **📥 Generate Report** → downloads completed Word file
4. Optionally delete the project from cloud when done

---

## 📂 Word Format Support

The app works with **any Word defect format** as long as:
- **Before photo** is on the **left cell**
- **After photo slot** is on the **right cell** (empty or already filled)

No configuration needed — the app detects the layout automatically.

---

## 📲 Install as App on Phone

### Android
1. Open the app URL in **Chrome**
2. Tap the **3 dots menu** → **Add to Home Screen**
3. Tap **Add** — icon appears on home screen

### iPhone
1. Open the app URL in **Safari**
2. Tap the **Share button** (box with arrow)
3. Tap **Add to Home Screen**
4. Tap **Add** — icon appears on home screen

---

## 🛠 Tech Stack

| Component | Technology |
|---|---|
| Frontend | HTML + CSS + JavaScript (no framework) |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Hosting | GitHub Pages |
| Word Processing | JSZip (client-side) |
| PWA | Service Worker + Web Manifest |

---

## 🗄 Supabase Setup

Run this SQL in your Supabase SQL Editor:

```sql
create table if not exists dt_projects (
  id text primary key,
  name text,
  created_at timestamptz default now(),
  docx_b64 text,
  xml_files jsonb,
  rels jsonb,
  defects jsonb
);

create table if not exists dt_after_photos (
  id serial primary key,
  project_id text references dt_projects(id) on delete cascade,
  tbl_idx integer,
  photo_b64 text,
  updated_at timestamptz default now(),
  unique(project_id, tbl_idx)
);

alter table dt_projects enable row level security;
alter table dt_after_photos enable row level security;

create policy "public_all" on dt_projects for all using (true) with check (true);
create policy "public_all" on dt_after_photos for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('defect-files', 'defect-files', true)
on conflict do nothing;

create policy "public_storage" on storage.objects
for all using (bucket_id = 'defect-files')
with check (bucket_id = 'defect-files');
```

---

## 📁 Files

| File | Description |
|---|---|
| `index.html` | Main app |
| `manifest.json` | PWA manifest for install as app |
| `sw.js` | Service worker for offline support |
| `icon-192.png` | App icon 192x192 |
| `icon-512.png` | App icon 512x512 |
| `README.md` | This file |

---

## 📝 Notes

- Images compressed to max 800px / 70% quality before upload
- Supabase free tier: 500MB database, 1GB storage
- Delete projects when done to free up space
- Multiple workers can work on same project simultaneously

---

*Built for field inspection teams*
