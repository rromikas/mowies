const origin = "https://calm-coast-57354.herokuapp.com";

const SendPostRequest = (path, data) => {
  return fetch(`${origin}${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const FindOrCreateMovie = (movie) => {
  return SendPostRequest("/movie/findOrCreate", movie);
};

// export const FindOrCreateSerie = (serie) => {
//   try {
//     return new Promise(async (resolve, reject) => {
//       let data = await Serie.find({ id: movie.id });
//       if (!data) {
//         newMovie = new Movie(movie);
//         newMovie.save((er) => {
//           if (er) {
//             resolve({ error: er });
//           } else {
//             resolve({ movie: newMovie });
//           }
//         });
//       } else {
//         resolve({ movie: data });
//       }
//     });
//   } catch (er) {
//     resolve({ error: er });
//   }
// };
