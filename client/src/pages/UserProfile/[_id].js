import ClientLayout from "@/Layout/ClientLayout";

export default function UserProfile({ _id }) {
    return (
        <ClientLayout>
            <h1>hello</h1>
            <h3>{_id}</h3>
        </ClientLayout>
    );
}

export async function getServerSideProps(context) {
    const { _id } = context.query;
    return {
        props: { _id }, // add safety
    };
}
