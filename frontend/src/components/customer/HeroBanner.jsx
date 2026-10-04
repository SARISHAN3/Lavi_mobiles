import { useState } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getImageUrl } from "../../config/image";

const HeroBanner = ({
  banners = [],
  autoPlay = true,
  interval = 5000,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalBanners = banners.length;

  const nextSlide = () => {
    if (totalBanners === 0) return;

    setActiveIndex((current) =>
      current === totalBanners - 1 ? 0 : current + 1,
    );
  };

  const previousSlide = () => {
    if (totalBanners === 0) return;

    setActiveIndex((current) =>
      current === 0 ? totalBanners - 1 : current - 1,
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  useState(() => {
    if (!autoPlay || totalBanners <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) =>
        current === totalBanners - 1 ? 0 : current + 1,
      );
    }, interval);

    return () => clearInterval(timer);
  });

  if (totalBanners === 0) {
    return (
      <section
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 ${className}`}
      >
        <div className="flex min-h-[300px] items-center px-6 py-12 sm:min-h-[380px] sm:px-10 lg:min-h-[450px] lg:px-16">
          <div className="max-w-xl text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-100">
              Welcome to Lavi Mobile
            </p>

            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Find Your Perfect Smartphone
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-orange-50 sm:text-base">
              Discover the latest smartphones, smart watches, accessories, and
              amazing deals at Lavi Mobile.
            </p>

            <a
              href="/mobiles"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
            >
              Shop Now
              <FiArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
    );
  }

  const banner = banners[activeIndex];

  if (!banner) {
    return null;
  }

  const desktopImage = banner.image || banner.desktopImage || "";

  const mobileImage = banner.mobileImage || desktopImage;

  const getBannerLink = () => {
    if (banner.linkType === "product" && banner.linkValue) {
      return `/product/${banner.linkValue}`;
    }

    if (banner.linkType === "category" && banner.linkValue) {
      return `/mobiles?category=${banner.linkValue}`;
    }

    if (banner.linkType === "products" && banner.linkValue) {
      return `/mobiles?collection=${banner.linkValue}`;
    }

    if (banner.linkType === "url" && banner.linkValue) {
      return banner.linkValue;
    }

    return "/mobiles";
  };

  return (
    <section className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]">
        {desktopImage && (
          <>
            <img
              src={getImageUrl(desktopImage)}
              alt={banner.title || "Lavi Mobile offer"}
              className="absolute inset-0 hidden h-full w-full object-cover sm:block"
            />

            <img
              src={getImageUrl(mobileImage)}
              alt={banner.title || "Lavi Mobile offer"}
              className="absolute inset-0 h-full w-full object-cover sm:hidden"
            />
          </>
        )}

        {!desktopImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="relative z-10 flex min-h-[280px] items-center px-6 py-10 sm:min-h-[360px] sm:px-10 lg:min-h-[440px] lg:px-16">
          <div className="max-w-xl text-white">
            {banner.subtitle && (
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-100 sm:text-sm">
                {banner.subtitle}
              </p>
            )}

            {banner.title && (
              <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {banner.title}
              </h1>
            )}

            {banner.description && (
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/90 sm:text-base">
                {banner.description}
              </p>
            )}

            <a
              href={getBannerLink()}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              {banner.buttonText || "Shop Now"}
              <FiArrowRight size={17} />
            </a>
          </div>
        </div>

        {totalBanners > 1 && (
          <>
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:left-5"
            >
              <FiChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:right-5"
            >
              <FiChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    activeIndex === index
                      ? "w-7 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
