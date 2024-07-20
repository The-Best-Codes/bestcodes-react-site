// pages/api/printables/highlighted-projects.js

import fetch from "node-fetch";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userID = req.query.user_id;
  const url = `https://api.printables.com/graphql/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      operationName: "ProfileHighlightedModels",
      variables: {
        userId: `${userID}`, // '491469': Best_codes
      },
      query:
        "query ProfileHighlightedModels($userId: ID!) {\n  user(id: $userId) {\n    id\n    highlightedModels {\n      models {\n        ...PrintListFragment\n        __typename\n      }\n      featured\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PrintListFragment on PrintType {\n  id\n  name\n  slug\n  ratingAvg\n  likesCount\n  liked\n  datePublished\n  dateFeatured\n  firstPublish\n  downloadCount\n  category {\n    id\n    path {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  modified\n  image {\n    ...ImageSimpleFragment\n    __typename\n  }\n  nsfw\n  premium\n  price\n  user {\n    ...AvatarUserFragment\n    __typename\n  }\n  ...LatestCompetitionResult\n  __typename\n}\n\nfragment AvatarUserFragment on UserType {\n  id\n  publicUsername\n  avatarFilePath\n  handle\n  company\n  verified\n  badgesProfileLevel {\n    profileLevel\n    __typename\n  }\n  __typename\n}\n\nfragment LatestCompetitionResult on PrintType {\n  latestCompetitionResult {\n    placement\n    competitionId\n    __typename\n  }\n  __typename\n}\n\nfragment ImageSimpleFragment on PrintImageType {\n  id\n  filePath\n  rotation\n  __typename\n}",
    }),
  });

  const data: any = await response.json();

  const resData = data.data.user.highlightedModels.models;

  const resDataMap = resData.map((project: any) => {
    return {
      name: project.name,
      url: `https://www.printables.com/model/${project.id}`,
      coverImage: {
        src: `https://media.printables.com/${project.image.filePath}`,
        alt: project.name,
      },
      description: project.name,
      updatedAt: project.datePublished,
    };
  });

  res.status(200).json(resDataMap);
}
