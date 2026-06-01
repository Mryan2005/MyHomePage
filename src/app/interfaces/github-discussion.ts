export interface GithubDiscussion {

    title: string;

    url: string;

    createdAt: string;

    body: string;

    closed: boolean;

    category: {

        name: string;

    };

    author: {

        login: string;

    };

    labels: {

        name: string;

    }[];

}
