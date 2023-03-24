import radioApi from "..";

// Title       string `json:"title"`
// 	Perfomancer string `json:"description"`
// 	Year        int    `json:"year"`

type TrackUploadParams = {
  id: string;
  formData: FormData;
};

const uploadHeaders = new Headers();
uploadHeaders.append("Content-Type", "multipart/form-data");

const uploadTrackEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    uploadTrack: build.mutation<void, TrackUploadParams>({
      query: ({ id, formData }) => ({
        url: `track/${id}/upload`,
        method: "POST",
        body: formData,
        headers: uploadHeaders,
      }),
      invalidatesTags: (_, __, { id }) => [{ id, type: "TRACKS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useUploadTrackMutation } = uploadTrackEndpoint;
