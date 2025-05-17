export interface Analysis {
    id: string;
    pageTitle: string;
    query: string;
    results: [
      {
        id: string;
        url: string;
        faviconUrl: string;
        mainPage?: {
          data?: {
            faviconUrl: string;
            pageTitle: string;
          };
        };
      }
    ];
    createdAt: string;
  }