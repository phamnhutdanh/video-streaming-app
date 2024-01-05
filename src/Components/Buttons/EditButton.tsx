import { Transition, Dialog } from "@headlessui/react";
import React, { useState, useRef, Fragment } from "react";
import { Edit } from "../Icons/Icons";
import "cropperjs/dist/cropper.css";
import { Button } from "./Buttons";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { env } from "~/env.mjs";
import Image from "next/image";
import crypto from "crypto";

interface EditButtonProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
  };
  refetch: () => Promise<unknown>;
}

export function EditButton({ video, refetch }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const [image, setImage] = useState<File | null>(null);

  const [user, setUser] = useState({
    title: video.title,
    description: video.description,
  });
  const addVideoUpdateMutation = api.video.updateVideo.useMutation();

  const { data: sessionData } = useSession();
  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    type UploadResponse = {
      secure_url: string;
    };
    const videoData = {
      id: video.id,
      userId: sessionData?.user.id as string,
      title: video.title || undefined,
      description: video.description || undefined,
      thumbnailUrl: video.thumbnailUrl || undefined,
    };

    const formData = new FormData();

    const publicId = new Date().getMilliseconds().toString();
    if (image) formData.append("file", image);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = crypto.createHash("sha1");
    signature.update(
      `public_id=${publicId}&timestamp=${timestamp}&upload_preset=${env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}${env.NEXT_PUBLIC_CLOUDINARY_API_SECTRECT}`
    );
    formData.append("upload_preset", env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append("public_id", publicId);
    formData.append("api_key", env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("api_secret", env.NEXT_PUBLIC_CLOUDINARY_API_SECTRECT);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature.digest("hex"));

    fetch(
      "https://api.cloudinary.com/v1_1/" +
        env.NEXT_PUBLIC_CLOUDINARY_NAME +
        "/image/upload",

      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json() as Promise<UploadResponse>)
      .then((data) => {
        if (
          user.title !== video.title ||
          user.description !== video.description ||
          data.secure_url !== undefined
        ) {
          const newVideoData = {
            ...videoData,
            ...(data.secure_url && { thumbnailUrl: data.secure_url }),
          };
          if (user.title !== video.title) newVideoData.title = user.title;
          if (user.description !== video.description)
            newVideoData.description = user.description;

          addVideoUpdateMutation.mutate(newVideoData, {
            onSuccess: () => {
              setOpen(false);
              void refetch();
            },
          });
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0] ? e.target.files[0] : null);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <button onClick={() => handleClick()}>
        <Edit className="mr-2 h-5 w-5 shrink-0 stroke-gray-600" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative "
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <>
                    <div className="sm:flex sm:items-start  ">
                      <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Edit Video
                        </Dialog.Title>
                        <p className="mt-2 text-sm text-gray-500">
                          Edit your thumbnail, title, or description
                        </p>
                        <div className="col-span-full">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Cover photo
                          </label>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              {image ? (
                                <p>Your image has been attached.</p>
                              ) : (
                                <>
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                                    >
                                      <span>Upload a file</span>

                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={onFileChange}
                                      />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs leading-5 text-gray-600">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Title
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              id="title"
                              onChange={handleInputChange}
                              value={user.title}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                          </div>

                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Description
                          </label>
                          <div className="mt-2">
                            <textarea
                              rows={4}
                              name="description"
                              id="description"
                              value={user.description || ""}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 p-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" relative mt-5 flex flex-row-reverse gap-2 sm:mt-4 ">
                      <Button
                        type="reset"
                        variant="primary"
                        size="lg"
                        onClick={() => handleSubmit()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary-gray"
                        size="lg"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export function ImageCropper({
  image,
  setOpen,
  handleSubmit,
  imageType,
}: {
  image: File | null | string;
  setOpen?: (open: boolean) => void;
  imageType?: "backgroundImage" | "image";
  handleSubmit?: (imageFile: File) => void;
}) {
  const completeCrop = () => {
    setOpen ? setOpen(false) : null;
  };

  const cancelCrop = () => {
    setOpen ? setOpen(false) : null;
  };

  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
        {image && (
          <div className="mt-5">
            <Image
              className="h-24 w-24 ring-4 ring-white sm:h-32 sm:w-32"
              width="2000"
              height="2000"
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt="error"
            />

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary-gray" size="lg" onClick={cancelCrop}>
                cancel
              </Button>
              <Button variant="primary" size="lg" onClick={completeCrop}>
                Upload
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
