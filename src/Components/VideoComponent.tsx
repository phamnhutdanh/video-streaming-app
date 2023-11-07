import Image from "next/image";
export function UserImage({
    image,
    className = "",
  }: {
    image: string;
    className?: string;
  }) {
    return (
      <div className={`relative h-10 w-10 ${className}`}>
        <Image
          src={image || "/profile.jpg"}
          alt=""
          className="absolute rounded-full"
          fill
        />
      </div>
    );
  }