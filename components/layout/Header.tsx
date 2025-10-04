'use client';

import { motion } from 'framer-motion';
import { Satellite, Shield, BarChart3, Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import ColorblindModeToggle from '@/components/ui/ColorblindModeToggle';

export default function Header() {
  const { activeView, setActiveView } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();
  const isOnDashboard = pathname === '/dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orbital', label: 'Orbital View', icon: Satellite },
    { id: 'defend-earth', label: 'Defend Earth', icon: Shield },
  ] as const;

  const handleNavClick = (viewId: string) => {
    if (!isOnDashboard) {
      router.push('/dashboard');
    }
    setActiveView(viewId as any);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/10 shadow-2xl"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  boxShadow: [
                    '0 0 20px rgba(0, 212, 255, 0.3)',
                    '0 0 40px rgba(0, 255, 159, 0.5)',
                    '0 0 20px rgba(0, 212, 255, 0.3)',
                  ],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-space-cyan to-space-neon flex items-center justify-center"
              >
                <Satellite className="w-6 h-6 text-black" />
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white glow-text">
                  Asteroid Impact Simulator
                </h1>
                <p className="text-xs text-gray-400 hidden md:block">
                  Planetary Defense Dashboard
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {/* Colorblind Mode Toggle */}
            <ColorblindModeToggle />
            
            {!isOnDashboard && (
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl flex items-center gap-2 text-white hover:bg-white/10 transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Home</span>
                </motion.button>
              </Link>
            )}

            {isOnDashboard &&
              navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavClick(item.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-space-cyan to-space-neon text-black font-bold shadow-lg shadow-space-cyan/50'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-space-cyan to-space-neon -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}

            {!isOnDashboard && (
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 159, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-space-cyan to-space-neon rounded-xl text-black font-bold flex items-center gap-2 shadow-lg shadow-space-cyan/30"
                >
                  <Satellite className="w-4 h-4" />
                  <span>Launch</span>
                </motion.button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
