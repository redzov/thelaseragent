import Image from "next/image";

const customerPhotos = [
  { src: "/images/customers/customer-1.jpg", alt: "Happy customer 1" },
  { src: "/images/customers/customer-2.jpg", alt: "Happy customer 2" },
  { src: "/images/customers/customer-3.jpg", alt: "Happy customer 3" },
  { src: "/images/customers/customer-4.jpg", alt: "Happy customer 4" },
];

export default function RecentBlogPosts() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          Our Happy Customers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customerPhotos.map((photo) => (
            <div
              key={photo.src}
              className="rounded-lg overflow-hidden aspect-[4/3] relative"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
