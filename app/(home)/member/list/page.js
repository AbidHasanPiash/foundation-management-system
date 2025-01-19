import NoDataFound from '@/components/admin/common/NoDataFound';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';
import SearchAndList from '@/components/section/member/SearchAndList';

export default async function MemberList() {
    // const members = await fetchDataAsServer(apiConfig?.GET_MEMBER_LIST);
    const types = await fetchDataAsServer(apiConfig?.GET_MEMBER_TYPE);

    return !types ? (
        <NoDataFound />
    ) : (
        <SearchAndList
            // members={members}
            types={types}
        />
    );
}
