import { useState } from "react";
import { askQuery, getQuery, getQueries, executeQuery } from "@/app/lib/service";
import { toast } from "react-toastify";
import appText from "../assets/strings";

type Props = {
    dbId: string;
};

const useChatViewController = ({ dbId }: Props) => {
    const [nlQuery, setNlQuery] = useState<string>("");
    const [showNlQuery, setShowNlQuery] = useState<string | null>(null);
    const [sql, setSql] = useState<string | null>(null);
    const [queries, setQueries] = useState([]);
    const [isFirst, setIsFirst] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    const [queryResult, setQueryResult] = useState<any>({});
    const [hasQueryExecuted, setHasQueryExecuted] = useState(false);
    const [queryError, setQueryError] = useState<string>("");


    const getQueryHistory = async () => {
        try {
            const res = await getQueries(dbId);
            setQueries(res.data.data.queries);
        } catch (error) {
            toast.error(appText.toast.errGeneric);
        }
    };

    const handleQuery = async (e: React.ChangeEvent<any>) => {
        e.preventDefault();
        try {
            setIsFirst(false);
            setSql(null);
            setShowNlQuery(nlQuery);
            setHasQueryExecuted(false);
            const formData = new FormData();
            formData.append("nl_query", nlQuery);
            formData.append("db_id", dbId);
            const res = await askQuery(formData);
            setSql(res.data.data.sql_query);
            setNlQuery("");
        } catch (error) {
            toast.error(appText.toast.errGeneric);
        }
    };

    const getQueryById = async (id: string) => {
        try {
            setIsFirst(false);
            setSql(null);
            setShowNlQuery(null);
            setHasQueryExecuted(false);
            const res = await getQuery({ id });
            setSql(res.data.data.query.sql_query);
            setShowNlQuery(res.data.data.query.nl_query);
            setNlQuery("");
        } catch (error) {
            toast.error(appText.toast.errGeneric);
        }
    };

    const handleQueryResponse = async () => {
        setHasQueryExecuted(false);
        setQueryError("");
        setQueryResult({});
        try {
            const formdata = new FormData();
            formdata.append("sql_query", sql as string);
            formdata.append("db_id", dbId);
            const response = await executeQuery(formdata);
            setQueryResult(response.data.data["query_result"]);
        } catch (error: any) {
            setQueryError(error.error);
            toast.error(appText.toast.errGeneric);
        }
        setHasQueryExecuted(true);
    }

    return {
        nlQuery,
        setNlQuery,
        showNlQuery,
        setShowNlQuery,
        sql,
        setSql,
        isFirst,
        setIsFirst,
        open,
        setOpen,
        getQueryHistory,
        handleQuery,
        getQueryById,
        queries,
        queryResult,
        setQueryResult,
        hasQueryExecuted,
        setHasQueryExecuted,
        handleQueryResponse,
        queryError,
    };
};

export default useChatViewController;