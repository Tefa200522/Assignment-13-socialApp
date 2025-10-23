import bcrypt from "bcrypt";


export const hash = async (planText:string): Promise<string> => bcrypt.hash (planText, 10);

export const compare = async (planText: string, hash: string): Promise<boolean> => bcrypt.compare (planText, hash);
 