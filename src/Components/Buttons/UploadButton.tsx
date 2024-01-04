import { Transition, Dialog } from "@headlessui/react";
import React, { useState, useRef, Fragment, ChangeEvent } from "react";
import { LoadingIndicator, Plus } from "../Icons/Icons";
import "cropperjs/dist/cropper.css";
import { Button } from "./Buttons";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { env } from "~/env.mjs";

export function UploadButton({ refetch }: { refetch: () => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const { data: sessionData } = useSession();
  const addVideoUpdateMutation = api.video.createVideo.useMutation();
  const uploadNormalVideo = api.video.uploadVideoToCloudinary.useMutation();

  const [folderPath, setFolderPath] = useState("");
  const [loading, setLoading] = useState(false);

  const errorMessage = "File size < 100MB";

  const uploadVideo = async () => {
    if (!uploadedVideo) {
      return;
    }

    const input = folderPath + "\\" + uploadedVideo?.name;
    setLoading(true);
    console.log("VIDEO SIZE: ", uploadedVideo!.size);

    uploadNormalVideo.mutate(input, {
      onError(error, variables, context) {
        console.log(error);
        setUploadedVideo(null);
        setLoading(false);
      },
      onSuccess: (res) => {
        console.log(res.secure_url);
        const videoData = {
          userId: sessionData?.user.id as string,
          videoUrl: res.secure_url,
        };
        addVideoUpdateMutation.mutate(videoData, {
          onSuccess: () => {
            void refetch();
          },
        });
        setOpen(false);
        setUploadedVideo(null);
        setLoading(false);
        void refetch();
      },
    });
  };

  const handleSubmit = async () => {
    type UploadResponse = {
      secure_url: string;
      url: string;
    };
    const videoData = {
      userId: sessionData?.user.id as string,
      videoUrl: "",
    };

    const formData = new FormData();
    const publicId = new Date().getMilliseconds().toString();

    formData.append("cloud_name", env.NEXT_PUBLIC_CLOUDINARY_NAME);
    formData.append("upload_preset", env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", "video");
    formData.append("delivery_type", "upload");
    formData.append("public_id", new Date().getMilliseconds().toString());
    formData.append("api_key", env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("api_secret", env.NEXT_PUBLIC_CLOUDINARY_API_SECTRECT);

    if (uploadedVideo) {
      formData.append("file", uploadedVideo);
    }

    const fetchUrl =
      "https://api.cloudinary.com/v1_1/" +
      env.NEXT_PUBLIC_CLOUDINARY_NAME +
      "/video/upload";

    fetch(fetchUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.secure_url !== undefined) {
          const newVideoData = {
            ...videoData,
            ...(data.secure_url && { videoUrl: data.secure_url }),
          };

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
      if (e.target.files[0]!.size >= 100000000) {
        return;
      }
      setUploadedVideo(e.target.files[0] ? e.target.files[0] : null);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUploadedVideo(null);
  };

  return (
    <>
      <Button
        onClick={() => handleClick()}
        variant="primary"
        size="2xl"
        className="ml-2 flex"
      >
        <Plus className="mr-2 h-5 w-5 shrink-0 stroke-white" />
        Upload
      </Button>

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
                          Upload Video
                        </Dialog.Title>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            autoComplete="given-name"
                            placeholder="Folder to file path"
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={folderPath}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setFolderPath(e.target.value)
                            }
                          />
                        </div>

                        <div className="col-span-full">
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              {uploadedVideo ? (
                                <p>Your video has been attached.</p>
                              ) : (
                                <div>
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                                    >
                                      <span>Upload a Video</span>
                                      <input
                                        type="text"
                                        className="sr-only"
                                        onChange={onFileChange}
                                      />
                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={onFileChange}
                                      />
                                      <p>{errorMessage}</p>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {loading ? (
                      <div className="mx-auto ml-56 mt-4 flex max-w-lg flex-col justify-center">
                        <LoadingIndicator> </LoadingIndicator>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {loading ? (
                      <div></div>
                    ) : (
                      <div className=" relative mt-5 flex flex-row-reverse gap-2 sm:mt-4 ">
                        <Button
                          type="reset"
                          variant="primary"
                          size="lg"
                          onClick={() => uploadVideo()}
                        >
                          Upload
                        </Button>
                        <Button
                          variant="secondary-gray"
                          size="lg"
                          onClick={() => handleClose()}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
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
