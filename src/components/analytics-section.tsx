"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { TrendingUp, Eye, Users, Award, Play, BarChart3, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Line, LineChart, Bar, BarChart, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function Counter({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

interface AnimatedProgressBarProps {
  percentage: number
  delay?: number
}

function AnimatedProgressBar({ percentage, delay = 0 }: AnimatedProgressBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage)
    }, delay)
    return () => clearTimeout(timer)
  }, [percentage, delay])

  return (
    <div className="space-y-3">
      <div className="w-full bg-gray-800/30 rounded-full h-2 overflow-hidden backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full transition-all duration-2000 ease-out shadow-sm"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 font-medium">
        <span>0%</span>
        <span className="text-gray-400">{percentage}%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

export default function AnalyticsSection(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Chart data
  const viewsData = [
    { month: "Jan", views: 45000 },
    { month: "Feb", views: 52000 },
    { month: "Mar", views: 48000 },
    { month: "Apr", views: 61000 },
    { month: "May", views: 75000 },
    { month: "Jun", views: 89000 },
  ]

  const projectsData = [
    { type: "YT", count: 28 },
    { type: "IG", count: 35 },
    { type: "TT", count: 42 },
    { type: "Corp", count: 18 },
  ]

  const revenueData = [
    { quarter: "Q1", revenue: 85000 },
    { quarter: "Q2", revenue: 120000 },
    { quarter: "Q3", revenue: 145000 },
    { quarter: "Q4", revenue: 180000 },
  ]

  interface Metric {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: number
    suffix?: string
    prefix?: string
    description: string
    chart: "line" | "bar" | "progress"
    highlight?: boolean
  }

  const metrics: Metric[] = [
    {
      icon: Eye,
      label: "Total Views Generated",
      value: 1200000,
      suffix: "+",
      description: "Across all client projects",
      chart: "line",
      highlight: true,
    },
    {
      icon: Play,
      label: "Projects Completed",
      value: 123,
      suffix: "+",
      description: "Successful video campaigns",
      chart: "bar",
    },
    {
      icon: TrendingUp,
      label: "Average View Increase",
      value: 185,
      suffix: "%",
      description: "Compared to previous content",
      chart: "progress",
    },
    {
      icon: Users,
      label: "Client Satisfaction",
      value: 96,
      suffix: "%",
      description: "Based on project reviews",
      chart: "progress",
    },
    {
      icon: Award,
      label: "Retention Rate",
      value: 87,
      suffix: "%",
      description: "Clients who return",
      chart: "progress",
    },
    {
      icon: BarChart3,
      label: "Revenue Generated",
      value: 450000,
      prefix: "$",
      suffix: "+",
      description: "For clients through content",
      chart: "line",
    },
  ]

  return (
    <section ref={sectionRef} className="bg-black min-h-screen py-24 px-4 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.01),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.008),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Floating particles */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div> */}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div
          className={`text-center mb-20 transition-all duration-1200 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400 font-medium">Performance Analytics</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Proven
            <span className="text-gray-400 font-light"> Results</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            Data-driven impact across industries. Here's how I transform content into measurable success stories.
          </p>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card
                key={metric.label}
                className={`group relative bg-gradient-to-br from-gray-900/40 to-gray-900/20 border-gray-800/40 backdrop-blur-sm transition-all duration-700 ease-out hover:border-gray-700/60 ${
                  metric.highlight ? "md:col-span-2 lg:col-span-1" : ""
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <CardContent className="p-7 relative overflow-hidden">
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 group-hover:bg-white/[0.08] group-hover:border-white/20 transition-all duration-300">
                        <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>

                  {/* Main Content */}
                  <div className="space-y-5">
                    {/* Number */}
                    <div className="text-4xl md:text-5xl font-bold text-white group-hover:text-gray-50 transition-colors duration-300 tracking-tight">
                      {isVisible && (
                        <Counter
                          end={metric.value}
                          duration={2200 + index * 150}
                          prefix={metric.prefix}
                          suffix={metric.suffix}
                        />
                      )}
                    </div>

                    {/* Label & Description */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {metric.label}
                      </h3>
                      <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300 leading-relaxed">
                        {metric.description}
                      </p>
                    </div>

                    {/* Enhanced Charts */}
                    <div className="h-20 w-full mt-6">
                      {metric.chart === "line" && index === 0 && (
                        <ChartContainer
                          config={{
                            views: {
                              label: "Views",
                              color: "rgba(255,255,255,0.8)",
                            },
                          }}
                          className="h-full w-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={viewsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <Line
                                type="monotone"
                                dataKey="views"
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth={2}
                                dot={false}
                                animationDuration={2500}
                                animationBegin={800}
                              />
                              <Line
                                type="monotone"
                                dataKey="views"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth={1}
                                dot={false}
                                animationDuration={2500}
                                animationBegin={800}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}

                      {metric.chart === "bar" && index === 1 && (
                        <ChartContainer
                          config={{
                            count: {
                              label: "Projects",
                              color: "rgba(255,255,255,0.8)",
                            },
                          }}
                          className="h-full w-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={projectsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <Bar
                                dataKey="count"
                                fill="rgba(255,255,255,0.7)"
                                radius={[2, 2, 0, 0]}
                                animationDuration={2500}
                                animationBegin={1000}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}

                      {metric.chart === "progress" && (
                        <AnimatedProgressBar percentage={metric.value} delay={1200 + index * 150} />
                      )}

                      {metric.chart === "line" && index === 5 && (
                        <ChartContainer
                          config={{
                            revenue: {
                              label: "Revenue",
                              color: "rgba(255,255,255,0.8)",
                            },
                          }}
                          className="h-full w-full"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth={2}
                                dot={false}
                                animationDuration={2500}
                                animationBegin={1400}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      )}
                    </div>
                  </div>

                  {/* Bottom border accent */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Enhanced CTA */}
        <div
          className={`text-center mt-24 transition-all duration-1200 delay-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] cursor-pointer group shadow-2xl shadow-white/5">
            <span>Ready to Generate Results Like These?</span>
            <TrendingUp className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
          <p className="text-gray-600 mt-6 text-sm font-light">
            Let's discuss how I can amplify your content's performance
          </p>
        </div>
      </div>
    </section>
  )
}
