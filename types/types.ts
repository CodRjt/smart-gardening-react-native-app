import { Models } from "react-native-appwrite";

export interface plant extends Models.Document{
    user_id:string;
    Plant_name:string;
    Plant_zone:number;
    plant_sno:number;
    Day_of_entry:string;
    last_watered:string;
    plant_desc:string;
    watering_interval_in_days:number;
    species:string;
    url:string;
}
export interface zone extends Models.Document{
    user_id: string;
    zone_id:number;
    last_watered:string;
}