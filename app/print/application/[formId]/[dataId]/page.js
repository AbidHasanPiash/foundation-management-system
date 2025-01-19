import Print from "./Print";
import apiConfig from "@/configs/apiConfig";
import { fetchDataAsServer } from "@/util/axios";

export default async function ApplicationPrint({ params }) {
    
    const { formId, dataId } = params;
    const formDetails = await fetchDataAsServer(apiConfig?.GET_SCHOLARSHIP_FORM_BY_ID+formId);
    const applicantDetails = await fetchDataAsServer(apiConfig?.GET_SCHOLARSHIP_FORM_DATA+formId+'/data/'+dataId);
    const organizationInfo = await fetchDataAsServer(apiConfig?.GET_GENERAL_INFO);

    return <Print formDetails={formDetails} applicantDetails={applicantDetails} organizationInfo={organizationInfo}/>
}