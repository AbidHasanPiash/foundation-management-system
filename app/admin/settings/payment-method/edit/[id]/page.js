import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle';
import MessageForm from '@/components/admin/form/MessageForm';
import PaymentMethodForm from '@/components/admin/form/PaymentMethodForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function PaymentMethodEditPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(
        apiConfig?.GET_PAYMENT_METHOD_BY_ID + id
    );

    return (
        <div className="space-y-4">
            <PageTitle title="Edit Payment Method" />
            {data ? <PaymentMethodForm data={data} /> : <NoDataFound />}
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_PAYMENT_METHOD);
    return Array.isArray(data)
        ? data?.map((item) => ({
              id: encodeURIComponent(item._id),
          }))
        : [];
}
