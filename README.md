# 🎟️ Event_Management

### A Modern Web Application for Managing Events with Supabase Backend

---

## 🚀 Overview
**Event_Management** is a full-stack web application designed to simplify event planning, registration, and participant management.  
It integrates a **Supabase backend** for authentication, database, and storage while offering a responsive and interactive frontend (built using frameworks like React, Bolt.dev, or similar).

This project was developed to streamline how organizers handle events — from announcements and user sign-ups to attendee tracking and real-time updates.

---

## 🧩 Features

✅ **User Authentication** — Secure sign-up, login, and role-based access using Supabase Auth.  
✅ **Event Creation & Editing** — Admins can create, update, and delete events with ease.  
✅ **Registration System** — Users can register for events in one click.  
✅ **Live Event Dashboard** — Displays event details, capacity, timings, and participant count.  
✅ **Database Integration** — All event and user data stored in Supabase PostgreSQL tables.  
✅ **Image Uploads** — Event banners and images stored securely in Supabase Storage.  
✅ **Real-Time Updates** — Event list updates dynamically with Supabase’s real-time capabilities.  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Bolt.dev / React.js / TailwindCSS |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Hosting** | Supabase / Vercel / Render |
| **Language** | JavaScript / TypeScript |
| **Database** | PostgreSQL (managed by Supabase) |

---

## ⚙️ Supabase Setup

### 1. Create a New Supabase Project
- Go to [https://supabase.com](https://supabase.com)
- Create a new project and get your `API URL` and `anon key`.

### 2. Database Schema
Create the following tables in **Supabase SQL Editor**:

```sql
-- Users Table
create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  role text default 'user',
  created_at timestamp default now()
);

-- Events Table
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  date date not null,
  location text,
  capacity int,
  image_url text,
  created_by uuid references users(id),
  created_at timestamp default now()
);

-- Registrations Table
create table registrations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  event_id uuid references events(id),
  registered_at timestamp default now(),
  unique (user_id, event_id)
);
