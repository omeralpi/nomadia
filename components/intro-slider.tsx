"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image"
import { useEffect, useState } from "react"
import { AuthButton } from "./auth-button"

const slides = [
    {
        title: "Be Your Own Bank",
        description: "Direct P2P exchanges with verified users. No intermediaries, keep the 12% for yourself.",
        image: require("@/public/p2p.svg")
    },
    {
        title: "Local Currency Exchange",
        description: "Find verified traders near you for instant currency swaps. USDC, EUR, TWD and more.",
        image: require("@/public/digital-currency.svg"),
    },
    {
        title: "Trust Through Transparency",
        description: "View trader profiles, transaction history, and reputation scores before every exchange.",
        image: require("@/public/world.svg"),
    },
    {
        title: "Global Network, Local Trades",
        description: "Connect with verified traders in your area. Safe, instant, and commission-free exchanges.",
        image: require("@/public/p2p.svg"),
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
        <div className="relative h-full w-full">
            <Carousel
                className="w-full"
                setApi={setApi}
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index} className="pl-0">
                            <div className="flex h-[80vh] flex-col items-center justify-center space-y-6 text-center">
                                <div className="relative h-[220px] max-w-full">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        className="h-full w-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
                                </div>

                                <div className="space-y-4 px-6">
                                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        {slide.title}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {slide.description}
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {!isLastSlide && (
                    <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </>
                )}
            </Carousel>

            <div className="absolute bottom-0 space-y-6 left-0 right-0 flex flex-col items-center gap-4">
                {isLastSlide && (
                    <AuthButton />
                )}
                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index ? "bg-primary" : "bg-primary/20"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
} 