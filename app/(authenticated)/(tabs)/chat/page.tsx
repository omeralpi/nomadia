import { ChatList } from "@/components/chat/chat-list";
import { DefaultLayout } from "@/components/default-layout";
import { PageHeader } from "@/components/page-header";

export default function Page() {
    return (
        <DefaultLayout>
            <PageHeader title="Messages" />
            <ChatList />
        </DefaultLayout>
    );
}