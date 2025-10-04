'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Rocket, Globe, Zap, Target, AlertTriangle, Clock, Telescope, Sparkles } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingScene = dynamic(() => import('@/components/3d/LandingScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-space-dark via-space-blue to-space-dark flex items-center justify-center">
      <div className="text-white text-xl">Loading 3D Scene...</div>
    </div>
  ),
});

const features = [
  {
    icon: Globe,
    title: 'Real NASA Data',
    description: 'Live asteroid tracking from NASA\'s Near-Earth Object API',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Rocket,
    title: '3D Visualization',
    description: 'Interactive orbital mechanics with real-time rendering',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: AlertTriangle,
    title: 'Impact Simulation',
    description: 'Scientific calculations for energy, crater size, and casualties',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Shield,
    title: 'Defend Earth Mode',
    description: 'Gamified planetary defense with deflection strategies',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Target,
    title: 'Precise Tracking',
    description: 'Monitor potentially hazardous asteroids in real-time',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Fast & Responsive',
    description: 'Built with Next.js 14 for optimal performance',
    color: 'from-indigo-500 to-purple-500',
  },
];

export default function LandingPage() {
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const earthOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Story chapter animations
      gsap.utils.toArray('.story-chapter').forEach((chapter: any, i) => {
        gsap.fromTo(
          chapter,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Number counters
      gsap.utils.toArray('.counter').forEach((counter: any) => {
        const target = counter.getAttribute('data-target');
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: counter,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Parallax effects
      gsap.utils.toArray('.parallax-slow').forEach((el: any) => {
        gsap.to(el, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, storyRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={storyRef} className="relative w-full overflow-x-hidden bg-black">
      {/* Full Screen 3D Scene */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ opacity: earthOpacity }}
      >
        <Suspense fallback={<div className="w-full h-full bg-space-dark" />}>
          <LandingScene />
        </Suspense>
      </motion.div>

      {/* Side gradients for depth */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-black/40 to-transparent" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Hero Content - Side positioned to not block Earth */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Logo Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center gap-3 glass-morphism px-4 py-2 rounded-full border border-white/20 backdrop-blur-md bg-black/40"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-space-cyan to-space-neon p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Shield className="w-4 h-4 text-space-cyan" />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-300">Powered by NASA Data</span>
              </motion.div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-space-cyan via-white to-space-neon bg-clip-text text-transparent">
                  Asteroid
                </span>
                <span className="block bg-gradient-to-r from-space-neon via-white to-space-cyan bg-clip-text text-transparent">
                  Impact
                </span>
                <span className="block text-white/90">Simulator</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
                Experience real-time asteroid tracking with stunning 3D visualization. 
                Simulate planetary defense and explore the cosmos.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 255, 159, 0.8)' }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-10 py-4 bg-gradient-to-r from-space-cyan to-space-neon rounded-full text-black font-bold text-lg flex items-center gap-3 shadow-2xl shadow-space-cyan/50"
                  >
                    Launch Simulator
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  { value: '30K+', label: 'Asteroids' },
                  { value: 'Real-time', label: 'Data' },
                  { value: '99%', label: 'Accurate' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="glass-morphism px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md bg-black/30"
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-space-cyan to-space-neon bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Earth Model visible here */}
            <div className="hidden lg:block relative h-[600px]">
              {/* This space is intentionally left empty to showcase the 3D Earth */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-0 right-0 glass-morphism px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md bg-black/40"
              >
                <p className="text-sm text-gray-300">
                  <span className="text-space-cyan font-semibold">Interactive 3D Earth</span> • Drag to rotate
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Full separate page */}
      <div id="features" className="relative z-20 min-h-screen bg-gradient-to-b from-black via-space-blue/10 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Advanced Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Powered by cutting-edge technology and real scientific data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group relative glass-morphism p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all overflow-hidden backdrop-blur-xl bg-space-dark/30"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-full h-full text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-20 py-24 px-4 bg-gradient-to-b from-black to-space-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-morphism p-10 rounded-3xl border border-white/20 backdrop-blur-xl bg-black/40"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore the Cosmos?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Track near-Earth asteroids and simulate planetary defense strategies.
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0, 255, 159, 0.8)' }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 bg-gradient-to-r from-space-cyan to-space-neon rounded-full text-black font-bold text-lg flex items-center gap-3 mx-auto shadow-2xl shadow-space-cyan/50"
            >
              Start Simulation
              <Rocket className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-20 border-t border-white/10 py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>
            &copy; 2025 Asteroid Impact Simulator. Powered by NASA NEO API.
          </p>
        </div>
      </div>
    </div>
  );
}
