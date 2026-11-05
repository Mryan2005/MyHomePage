export type WanderlistStatus = 'visited' | 'wishlist';

export interface WanderlistPlace {
    id: string;
    title: string;
    location: string;
    image?: string;
    status: WanderlistStatus;
}

export const WANDERLIST_DEFAULT_IMAGE = '/assets/images/wanderlist/unvisited-default.png';

// Demo 数据，不代表真实旅行记录；可直接替换、增删以下条目。
// status: 'visited' = 已去过，'wishlist' = 想去。
// image 支持远程图片 URL 或 /assets/images/... 本地路径。
// 不填 image 时使用统一的旅行主题缺省图；图片加载失败也会回退到缺省图。
export const WANDERLIST: readonly WanderlistPlace[] = [
    {
        id: 'shanghai',
        title: 'A Walk Along the Bund',
        location: 'Shanghai, China',
        image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?auto=format&fit=crop&w=800&q=80',
        status: 'visited',
    },
    {
        id: 'great-wall',
        title: 'Walk the Great Wall',
        location: 'Beijing, China',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
        status: 'visited',
    },
    {
        id: 'kyoto',
        title: 'Slow Days in Kyoto',
        location: 'Kyoto, Japan',
        status: 'wishlist',
    },
    {
        id: 'rome',
        title: 'Explore the Colosseum',
        location: 'Rome, Italy',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        status: 'visited',
    },
    {
        id: 'iceland',
        title: 'Chase Icelandic Waterfalls',
        location: 'Iceland',
        status: 'wishlist',
    },
    {
        id: 'paris',
        title: 'An Afternoon in Paris',
        location: 'Paris, France',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        status: 'visited',
    },
    {
        id: 'dolomites',
        title: 'Hike the Dolomites',
        location: 'Dolomites, Italy',
        status: 'wishlist',
    },
    {
        id: 'swiss-alps',
        title: 'Under an Alpine Sky',
        location: 'Swiss Alps, Switzerland',
        status: 'wishlist',
    },
    {
        id: 'cinque-terre',
        title: 'Wander the Colorful Coast',
        location: 'Cinque Terre, Italy',
        status: 'wishlist',
    },
    {
        id: 'new-zealand',
        title: 'Take the Scenic Route',
        location: 'South Island, New Zealand',
        status: 'wishlist',
    },
];
