# Pixel Console UI Migration Guide

This project has been migrated to a new "Handheld Console" pixel art UI.

## 🎮 Key Features
- **Retro Aesthetic**: Full pixel art design with CRT scanlines and isometric background.
- **Zpix Font**: High-quality pixel font support for Chinese/English.
- **Interactive Controls**:
  - **A Button**: Send message
  - **B Button**: Reset chat (with confirmation)
  - **D-Pad**: Decorative (currently)
  - **Quick Actions**: One-click prompt suggestions
- **Tech Stack**: Next.js, Tailwind CSS, Framer Motion, Vercel AI SDK.

## 📁 Project Structure
- `components/console/`: Hardware UI (handheld shell, buttons, d-pad, background)
- `components/chat/`: Chat interface (screen, avatar, typewriter)
- `components/modals/`: Popup dialogs (confirm, profile)
- `components/ui/`: Generic Shadcn components
- `public/fonts/zpix.ttf`: Local pixel font file

## 🚀 Getting Started
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
3. **Environment Variables**:
   Ensure `.env.local` has valid keys for:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DEEPSEEK_API_KEY` (or other provider)

## 🛠️ Customization
- **Fonts**: Configured in `app/layout.tsx` and `tailwind.config.ts`.
- **Styles**: Global pixel styles in `app/globals.css`.
- **Animations**: Powered by `framer-motion` in individual components.

## 🧹 Cleanup
Old components (`ChatInterface`, `ChatArea`, `ChatInput`) and the `ui-demo-temp` folder have been removed.
