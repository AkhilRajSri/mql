import { getAllDatabase } from "@/app/lib/service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import appText from "../assets/strings";

type Database = {
    id: string;
    name: string;
    connection_string: boolean;
    created_at: string;
};

const useHomeAccountsViewController = () => {
    const [databases, setDatabases] = useState<Database[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        const fetchAllDB = async () => {
            try {
                const response = await getAllDatabase();
                setDatabases(response.data.data.user_databases);
            } catch (error) {
                toast.error(appText.toast.errGeneric);
            }
        };
        fetchAllDB();
    }, [refresh]);

    const refreshDatabases = () => {
        setRefresh(!refresh);
    }

    return { databases, refreshDatabases };
}

export default useHomeAccountsViewController;