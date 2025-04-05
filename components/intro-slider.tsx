"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { AuthButton } from "./auth-button"

const slides = [
    {
        title: "Local P2P Currency Exchange",
        description: "Exchange currencies directly with verified users in your area through secure peer-to-peer transactions.",
        image: require("@/public/p2p.svg"),
        bgColor: "from-primary/5 via-primary/10 to-primary/5"
    },
    {
        title: "World ID Verified Users",
        description: "Trade with confidence using World ID verification system ensuring secure and trusted exchanges.",
        image: require("@/public/digital-currency.svg"),
        bgColor: "from-primary/10 via-primary/15 to-primary/10"
    },
    {
        title: "Interactive Map & Chat",
        description: "Find nearby traders on the interactive map and communicate directly through our built-in chat system.",
        image: require("@/public/world.svg"),
        bgColor: "from-primary/15 via-primary/20 to-primary/15"
    },
    {
        title: "Manage Your Listings",
        description: "Create and manage your exchange listings, set your rates, and track your transaction history.",
        image: require("@/public/p2p.svg"),
        bgColor: "from-primary/20 via-primary/25 to-primary/20"
    },
]

export function IntroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [api, setApi] = useState<CarouselApi>()

    const isLastSlide = currentSlide === slides.length - 1

    useEffect(() => {
        if (!api) return

        api.on("select", () => {
            setCurrentSlide(api.selectedScrollSnap())
        })
    }, [api])

    return (
        <div className="relative h-full w-full overflow-hidden">
            <motion.div
                className={`absolute inset-0  transition-colors duration-700 ease-in-out ${slides[currentSlide].bgColor}`}
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.7 }}
            />
            <Carousel
                className="w-full"
                setApi={setApi}
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index} className="pl-0">
                            <div className="flex h-[80vh] flex-col items-center justify-center space-y-6 text-center">
                                <motion.div
                                    className="relative h-[220px] max-w-full"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                        transition: { duration: 0.5, delay: 0.2 }
                                    }}
                                    whileInView={{
                                        y: [0, -10, 0],
                                        transition: {
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                >
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        className="h-full w-full object-contain"
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { duration: 0.5, delay: 0.3 }
                                        }}
                                    />
                                </motion.div>

                                <motion.div
                                    className="space-y-4 px-6"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                staggerChildren: 0.2,
                                                delayChildren: 0.4
                                            }
                                        }
                                    }}
                                >
                                    <motion.h2
                                        className="text-2xl font-bold tracking-tight sm:text-3xl"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        {slide.title}
                                    </motion.h2>
                                    <motion.p
                                        className="text-muted-foreground"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        {slide.description}
                                    </motion.p>
                                </motion.div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {!isLastSlide && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <CarouselPrevious className="left-4" />
                            <CarouselNext className="right-4" />
                        </motion.div>
                    </AnimatePresence>
                )}
            </Carousel>

            <motion.div
                className="absolute bottom-0 space-y-6 left-0 right-0 flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <AnimatePresence mode="wait">
                    {isLastSlide && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", duration: 0.5 }}
                        >
                            <AuthButton />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index ? "bg-primary" : "bg-primary/20"}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: currentSlide === index ? 1.2 : 1,
                                opacity: 1
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )
} 