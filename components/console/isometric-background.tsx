"use client"

import { motion } from "framer-motion"

// Pixel art building component
function PixelBuilding({
  x,
  y,
  width,
  height,
  color,
  windowColor = "#1a1a2e",
}: {
  x: number
  y: number
  width: number
  height: number
  color: string
  windowColor?: string
}) {
  const windows = []
  const windowSize = 4
  const windowGap = 6
  const cols = Math.floor((width - 8) / windowGap)
  const rows = Math.floor((height - 12) / windowGap)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Use deterministic pattern instead of Math.random() to avoid hydration errors
      const isLit = (row + col) % 3 === 0
      windows.push(
        <rect
          key={`${row}-${col}`}
          x={x + 4 + col * windowGap}
          y={y + 6 + row * windowGap}
          width={windowSize}
          height={windowSize}
          fill={isLit ? "#ffeaa7" : windowColor}
          opacity={isLit ? 0.8 : 0.5}
        />,
      )
    }
  }

  return (
    <g>
      {/* Building body */}
      <rect x={x} y={y} width={width} height={height} fill={color} />
      {/* Top edge highlight */}
      <rect x={x} y={y} width={width} height={2} fill={color} opacity={0.7} />
      {/* Right edge shadow */}
      <rect x={x + width - 2} y={y} width={2} height={height} fill="#0a0a12" opacity={0.4} />
      {/* Windows */}
      {windows}
    </g>
  )
}

// Server rack with blinking lights
function ServerRack({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Rack body */}
      <rect x={x} y={y} width={20} height={30} fill="#1a1a2e" />
      <rect x={x} y={y} width={20} height={2} fill="#2d2d44" />
      {/* Blinking lights */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={i}
          x={x + 3}
          y={y + 5 + i * 5}
          width={3}
          height={2}
          fill="#00ff88"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.4,
          }}
        />
      ))}
      {/* More lights in different color */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={`red-${i}`}
          x={x + 8}
          y={y + 5 + i * 5}
          width={3}
          height={2}
          fill="#ff6b6b"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
          }}
        />
      ))}
    </g>
  )
}

// Circuit path on ground
function CircuitPath({ points }: { points: string }) {
  return (
    <g>
      <path d={points} stroke="#0d4d4d" strokeWidth={3} fill="none" opacity={0.6} />
      <path d={points} stroke="#00ff88" strokeWidth={1} fill="none" opacity={0.3} />
    </g>
  )
}

// Animated pixel character - Engineer
function PixelEngineer({ startX, endX, y, duration }: { startX: number; endX: number; y: number; duration: number }) {
  return (
    <motion.g
      animate={{ x: [startX, endX, startX] }}
      transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {/* Body */}
      <rect x={0} y={y} width={6} height={8} fill="#4a69bd" />
      {/* Head */}
      <rect x={1} y={y - 5} width={4} height={5} fill="#ffeaa7" />
      {/* Hard hat */}
      <rect x={0} y={y - 7} width={6} height={3} fill="#f9ca24" />
      {/* Wrench */}
      <motion.rect
        x={6}
        y={y + 2}
        width={4}
        height={2}
        fill="#95a5a6"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
      />
    </motion.g>
  )
}

// Animated pixel robot
function PixelRobot({ startX, endX, y, duration }: { startX: number; endX: number; y: number; duration: number }) {
  return (
    <motion.g
      animate={{ x: [startX, endX, startX] }}
      transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {/* Body */}
      <rect x={0} y={y} width={8} height={10} fill="#636e72" />
      {/* Head */}
      <rect x={1} y={y - 6} width={6} height={6} fill="#95a5a6" />
      {/* Antenna */}
      <rect x={3} y={y - 9} width={2} height={3} fill="#2d3436" />
      <motion.circle
        cx={4}
        cy={y - 10}
        r={2}
        fill="#ff6b6b"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
      />
      {/* Eyes */}
      <motion.rect
        x={2}
        y={y - 4}
        width={2}
        height={2}
        fill="#00ff88"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.rect
        x={5}
        y={y - 4}
        width={2}
        height={2}
        fill="#00ff88"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
      />
      {/* Wheels */}
      <circle cx={2} cy={y + 11} r={2} fill="#2d3436" />
      <circle cx={6} cy={y + 11} r={2} fill="#2d3436" />
    </motion.g>
  )
}

// Sleeping pixel cat on server
function SleepingCat({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Body */}
      <ellipse cx={x + 6} cy={y + 4} rx={6} ry={4} fill="#2d3436" />
      {/* Head */}
      <circle cx={x + 10} cy={y + 2} r={3} fill="#2d3436" />
      {/* Ears */}
      <polygon points={`${x + 8},${y - 1} ${x + 9},${y + 1} ${x + 10},${y - 1}`} fill="#2d3436" />
      <polygon points={`${x + 11},${y - 1} ${x + 12},${y + 1} ${x + 13},${y - 1}`} fill="#2d3436" />
      {/* Tail */}
      <motion.path
        d={`M ${x + 1} ${y + 3} Q ${x - 3} ${y} ${x - 2} ${y + 5}`}
        stroke="#2d3436"
        strokeWidth={2}
        fill="none"
        animate={{
          d: [
            `M ${x + 1} ${y + 3} Q ${x - 3} ${y} ${x - 2} ${y + 5}`,
            `M ${x + 1} ${y + 3} Q ${x - 4} ${y + 2} ${x - 2} ${y + 6}`,
            `M ${x + 1} ${y + 3} Q ${x - 3} ${y} ${x - 2} ${y + 5}`,
          ],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {/* Zzz */}
      <motion.text
        x={x + 14}
        y={y - 3}
        fill="#a0a0a0"
        fontSize={6}
        fontFamily="monospace"
        animate={{ opacity: [0, 1, 0], y: [y - 3, y - 8, y - 3] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        z
      </motion.text>
    </g>
  )
}

// Floating data particles
function DataParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.rect
      x={x}
      y={y}
      width={2}
      height={2}
      fill="#00ff88"
      animate={{
        y: [y, y - 40],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "linear",
      }}
    />
  )
}

export function IsometricBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0d1117] to-[#0a1628]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* SVG Scene */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {/* Circuit paths */}
        <CircuitPath points="M 50 450 L 150 450 L 150 500 L 300 500" />
        <CircuitPath points="M 500 480 L 600 480 L 600 420 L 750 420" />
        <CircuitPath points="M 200 550 L 400 550 L 400 520 L 600 520" />

        {/* Background buildings - far */}
        <PixelBuilding x={20} y={200} width={60} height={120} color="#12121f" />
        <PixelBuilding x={90} y={180} width={45} height={140} color="#15152a" />
        <PixelBuilding x={680} y={190} width={55} height={130} color="#12121f" />
        <PixelBuilding x={740} y={210} width={50} height={110} color="#15152a" />

        {/* Mid buildings */}
        <PixelBuilding x={140} y={240} width={50} height={100} color="#1a1a2e" />
        <PixelBuilding x={620} y={230} width={55} height={110} color="#1a1a2e" />

        {/* Server racks */}
        <ServerRack x={60} y={400} />
        <ServerRack x={90} y={390} />
        <ServerRack x={680} y={380} />
        <ServerRack x={710} y={395} />

        {/* Sleeping cat on server */}
        <SleepingCat x={95} y={378} />

        {/* Animated characters */}
        <PixelEngineer startX={150} endX={280} y={460} duration={25} />
        <PixelRobot startX={500} endX={650} y={445} duration={30} />
        <PixelEngineer startX={600} endX={720} y={520} duration={35} />

        {/* Data particles rising from buildings */}
        {[0, 1, 2, 3, 4].map((i) => (
          <DataParticle key={`left-${i}`} x={45 + i * 15} y={320} delay={i * 0.8} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <DataParticle key={`right-${i}`} x={690 + i * 12} y={320} delay={i * 0.6 + 0.3} />
        ))}

        {/* Ground plane hint */}
        <rect x={0} y={560} width={800} height={40} fill="#0a0a12" opacity={0.8} />
      </svg>

      {/* Blur/dim overlay to push background deeper */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(10, 10, 18, 0.6) 70%)",
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 200px 100px rgba(0, 0, 0, 0.5)",
        }}
      />
    </div>
  )
}
