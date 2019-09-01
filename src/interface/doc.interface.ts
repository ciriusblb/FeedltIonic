import { Timestamp } from "rxjs/internal/operators/timestamp";


export interface Doc {
    text: string;
    created: Timestamp<any>;
    owner: string;
    owner_name: string;
    likes?: any;
    likesCount?: number;
    image?: string;
    id?: string;
    commentsCount?: number;
}
