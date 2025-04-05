import { ChatList } from "@/components/chat/chat-list";
import { DefaultLayout } from "@/components/default-layout";
import { PageHeader } from "@/components/page-header";
import { SearchForm } from "@/components/search-form";

export default function Page() {
    return (
        <DefaultLayout>
            <PageHeader title="Messages" />
            <SearchForm placeholder="Search messages" />
            <ChatList />
        </DefaultLayout>
    );
}