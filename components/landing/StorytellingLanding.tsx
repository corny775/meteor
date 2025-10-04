'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, Telescope, AlertTriangle, Rocket, Sparkles, Zap, Target, Globe, Clock } from 'lucide-react';
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

export default function StorytellingLanding() {
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const earthOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.4, 0.4, 1]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Story chapter animations
      gsap.utils.toArray('.story-chapter').forEach((chapter: any, i) => {
        gsap.fromTo(
          chapter,
          { opacity: 0, y: 100, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 75%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Number counters with animation
      gsap.utils.toArray('.counter').forEach((counter: any) => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.fromTo(
          counter,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2.5,
            snap: { innerText: 1 },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: counter,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            onUpdate: function() {
              counter.innerText = Math.ceil(this.targets()[0].innerText);
            }
          }
        );
      });

      // Parallax effects
      gsap.utils.toArray('.parallax-slow').forEach((el: any) => {
        gsap.to(el, {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      // Floating animation for cards
      gsap.utils.toArray('.float-card').forEach((card: any, i) => {
        gsap.to(card, {
          y: -20,
          duration: 2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, storyRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={storyRef} className="relative w-full overflow-x-hidden bg-black">
      {/* Full Screen 3D Scene with parallax */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ opacity: earthOpacity }}
      >
        <Suspense fallback={<div className="w-full h-full bg-space-dark" />}>
          <LandingScene />
        </Suspense>
      </motion.div>

      {/* Vignette overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
      </div>

      {/* Hero Section */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, type: 'spring' }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-space-cyan to-space-neon p-1 shadow-2xl shadow-space-cyan/60 animate-pulse">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Shield className="w-10 h-10 text-space-cyan" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6"
          >
            <span className="block bg-gradient-to-r from-space-cyan via-white to-space-neon bg-clip-text text-transparent animate-gradient">
              September 14
            </span>
            <span className="block text-white/90">2025</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            A hypothetical scenario. An asteroid on collision course with Earth.
            <br />
            <span className="text-space-cyan font-bold">127 days until impact.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <p className="text-gray-400 mb-8 flex items-center justify-center gap-2">
              <ArrowRight className="w-5 h-5 rotate-90 animate-bounce" />
              Scroll to begin
            </p>
          </motion.div>
        </div>
      </div>

      {/* Chapter 1: The Discovery */}
      <div className="story-chapter relative z-20 min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-3 glass-morphism px-6 py-3 rounded-full border border-cyan-500/40 backdrop-blur-xl bg-black/70 mb-8 mx-auto"
            whileHover={{ scale: 1.05, borderColor: 'rgba(0, 255, 159, 0.6)' }}
          >
            <Telescope className="w-6 h-6 text-space-cyan animate-pulse" />
            <span className="text-space-cyan font-bold text-lg">Chapter 1: The Discovery</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-center text-white mb-8 leading-tight">
            <span className="block parallax-slow bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              May 15, 2025
            </span>
          </h2>

          <div className="parallax-slow space-y-8">
            <p className="text-2xl md:text-3xl text-center text-gray-200 leading-relaxed max-w-3xl mx-auto">
              Pan-STARRS observatory in Hawaii detects an unusual Near-Earth Object moving at unprecedented speed...
            </p>

            <div className="glass-morphism p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-xl bg-gradient-to-br from-black/80 to-cyan-950/30 max-w-2xl mx-auto">
              <p className="text-xl text-gray-300 mb-6 text-center">
                <span className="text-3xl font-bold text-space-cyan block mb-2">Asteroid 2025-AZ₄</span>
                Trajectory anomaly detected
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="float-card glass-morphism p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-xl bg-black/60 text-center">
                <div className="text-6xl font-black text-space-cyan counter mb-2" data-target="850">0</div>
                <p className="text-gray-300 font-semibold">meters</p>
                <p className="text-gray-500 text-sm mt-1">diameter</p>
              </div>
              <div className="float-card glass-morphism p-8 rounded-2xl border border-orange-500/20 backdrop-blur-xl bg-black/60 text-center">
                <div className="text-6xl font-black text-orange-400 counter mb-2" data-target="127">0</div>
                <p className="text-gray-300 font-semibold">days</p>
                <p className="text-gray-500 text-sm mt-1">until close approach</p>
              </div>
              <div className="float-card glass-morphism p-8 rounded-2xl border border-purple-500/20 backdrop-blur-xl bg-black/60 text-center">
                <div className="text-6xl font-black text-purple-400">73%</div>
                <p className="text-gray-300 font-semibold">confidence</p>
                <p className="text-gray-500 text-sm mt-1">initial calculation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 2: The Realization */}
      <div className="story-chapter relative z-20 min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-transparent via-red-950/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-3 glass-morphism px-6 py-3 rounded-full border border-red-500/40 backdrop-blur-xl bg-black/70 mb-8 mx-auto"
            whileHover={{ scale: 1.05, borderColor: 'rgba(239, 68, 68, 0.6)' }}
          >
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            <span className="text-red-400 font-bold text-lg">Chapter 2: The Realization</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-center text-white mb-8 leading-tight">
            <span className="block parallax-slow bg-gradient-to-r from-red-400 via-orange-300 to-red-500 bg-clip-text text-transparent">
              Impact Confirmed
            </span>
          </h2>

          <div className="parallax-slow space-y-8">
            <p className="text-2xl md:text-3xl text-center text-gray-200 leading-relaxed max-w-3xl mx-auto">
              After 47 days of continuous tracking, international observatories confirm:
              <span className="block mt-4 text-3xl md:text-4xl font-bold text-red-400">
                Direct collision course
              </span>
            </p>

            <div className="glass-morphism p-10 rounded-3xl border border-red-500/30 backdrop-blur-xl bg-gradient-to-br from-red-950/40 to-black/60 max-w-3xl mx-auto">
              <p className="text-2xl text-center text-red-300 mb-8 font-bold">IMPACT ZONE</p>
              <p className="text-xl text-gray-300 text-center mb-8">
                North Atlantic Ocean
                <br />
                <span className="text-gray-400 text-lg">400km west of Portugal</span>
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-red-500/30">
                <div className="text-center">
                  <div className="text-6xl font-black text-red-400 counter mb-2" data-target="47">0</div>
                  <p className="text-gray-300 font-semibold text-lg">Megatons</p>
                  <p className="text-gray-500 text-sm mt-1">Impact energy</p>
                  <p className="text-red-400 text-xs mt-2">≈ 3,000 Hiroshima bombs</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-orange-400 counter mb-2" data-target="2">0</div>
                  <p className="text-gray-300 font-semibold text-lg">Million</p>
                  <p className="text-gray-500 text-sm mt-1">People at risk</p>
                  <p className="text-orange-400 text-xs mt-2">Coastal evacuations needed</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-red-400 text-xl font-bold animate-pulse">
                September 19, 2025 • 14:37 UTC
              </p>
              <p className="text-gray-400">Estimated impact time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 3: The Response */}
      <div className="story-chapter relative z-20 min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-3 glass-morphism px-6 py-3 rounded-full border border-purple-500/40 backdrop-blur-xl bg-black/70 mb-8 mx-auto"
            whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.6)' }}
          >
            <Rocket className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-purple-400 font-bold text-lg">Chapter 3: Planetary Defense</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-center text-white mb-8 leading-tight">
            <span className="block parallax-slow bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent">
              Mission: Defend Earth
            </span>
          </h2>

          <div className="parallax-slow space-y-12">
            <p className="text-2xl md:text-3xl text-center text-gray-200 leading-relaxed max-w-3xl mx-auto">
              Global space agencies unite for humanity's most critical mission.
              <span className="block mt-4 text-purple-400 font-bold">
                Three deflection strategies deployed
              </span>
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="float-card glass-morphism p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-xl bg-gradient-to-br from-cyan-950/40 to-black/60"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">Kinetic Impactor</h3>
                <p className="text-gray-400 text-center mb-4 leading-relaxed">
                  High-speed spacecraft collision to alter trajectory
                </p>
                <div className="space-y-2 text-sm text-gray-500 text-center">
                  <p>Velocity: 23,000 km/h</p>
                  <p>Launch window: 45 days</p>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-3xl font-black text-cyan-400">85%</span>
                  <p className="text-gray-400 text-sm">Success probability</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="float-card glass-morphism p-8 rounded-3xl border border-orange-500/30 backdrop-blur-xl bg-gradient-to-br from-orange-950/40 to-black/60"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/50">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">Nuclear Option</h3>
                <p className="text-gray-400 text-center mb-4 leading-relaxed">
                  Subsurface detonation for maximum deflection
                </p>
                <div className="space-y-2 text-sm text-gray-500 text-center">
                  <p>Yield: 1 megaton</p>
                  <p>Standoff distance: 100m</p>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-3xl font-black text-orange-400">92%</span>
                  <p className="text-gray-400 text-sm">Success probability</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="float-card glass-morphism p-8 rounded-3xl border border-green-500/30 backdrop-blur-xl bg-gradient-to-br from-green-950/40 to-black/60"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">Gravity Tractor</h3>
                <p className="text-gray-400 text-center mb-4 leading-relaxed">
                  Gradual gravitational pull over extended period
                </p>
                <div className="space-y-2 text-sm text-gray-500 text-center">
                  <p>Duration: 60-90 days</p>
                  <p>Proximity: 50-200m</p>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-3xl font-black text-green-400">78%</span>
                  <p className="text-gray-400 text-sm">Success probability</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 4: Your Turn */}
      <div className="story-chapter relative z-20 min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-transparent via-cyan-950/30 to-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-3 glass-morphism px-6 py-3 rounded-full border border-cyan-500/40 backdrop-blur-xl bg-black/70 mb-8 mx-auto"
            whileHover={{ scale: 1.05, borderColor: 'rgba(0, 255, 159, 0.6)' }}
          >
            <Sparkles className="w-6 h-6 text-space-cyan animate-pulse" />
            <span className="text-space-cyan font-bold text-lg">Your Mission Begins</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-center text-white mb-8 leading-tight">
            <span className="block parallax-slow bg-gradient-to-r from-space-cyan via-white to-space-neon bg-clip-text text-transparent animate-gradient">
              Can You Save
            </span>
            <span className="block parallax-slow text-white">Earth?</span>
          </h2>

          <div className="parallax-slow space-y-12">
            <p className="text-2xl md:text-3xl text-center text-gray-200 leading-relaxed max-w-3xl mx-auto">
              The fate of <span className="text-space-cyan font-bold">8 billion people</span> rests in your hands.
              <span className="block mt-4">
                Use real NASA data and scientific simulations to prevent catastrophe.
              </span>
            </p>

            <div className="flex justify-center">
              <Link href="/dashboard">
                <motion.button
                  initial={{ scale: 1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: '0 0 80px rgba(0, 255, 159, 1)',
                    y: -8
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-16 py-6 bg-gradient-to-r from-space-cyan to-space-neon rounded-full text-black font-black text-2xl flex items-center gap-4 shadow-2xl shadow-space-cyan/60 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    Launch Simulation
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white to-space-cyan opacity-0 group-hover:opacity-20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
              {[
                { icon: Telescope, label: 'Track 30K+ asteroids', color: 'cyan' },
                { icon: Target, label: 'Simulate impacts', color: 'orange' },
                { icon: Shield, label: 'Test deflection strategies', color: 'purple' },
                { icon: Globe, label: 'Save the planet', color: 'green' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-morphism p-6 rounded-2xl border border-white/20 backdrop-blur-xl bg-black/50"
                >
                  <item.icon className={`w-10 h-10 text-${item.color}-400 mx-auto mb-3`} />
                  <p className="text-gray-300 text-sm text-center font-medium">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20 border-t border-white/10 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p className="mb-2">
            This is a <span className="text-space-cyan font-semibold">hypothetical scenario</span> for educational purposes.
          </p>
          <p>
            &copy; 2025 Asteroid Impact Simulator. Powered by NASA NEO API.
          </p>
        </div>
      </div>
    </div>
  );
}
