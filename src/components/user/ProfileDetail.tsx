import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import UpdateUserInfo from "@/components/form/UpdateUserInfo";

const ProfileDetail: React.FC = () => {

    const { user } = useSelector(
        (state: RootState) => state.auth,
    );
    const [userInfoForm, setUserInfoForm] = useState<boolean>(false);

    return (
        <div className="space-y-5 md:space-y-10">
            <section className="md:mx-auto w-full p-6">
                <div className="flex flex-col items-center justify-center border rounded-md p-4">
                   

                    <div className="rounded-lg w-full p-4 md:p-6 space-y-4 md:max-w-[50%]">
                        <div className="flex justify-between items-center">
                            <dt className="text-sm md:text-lg font-medium text-muted-foreground">
                                Full Name
                            </dt>
                            <dd className="text-sm md:text-lg">
                                {user?.fullName || "Not provided"}
                            </dd>
                        </div>

                        <div className="flex justify-between items-center">
                            <dt className="text-sm md:text-lg font-medium text-muted-foreground">
                                Email
                            </dt>
                            <dd className="text-sm md:text-lg">
                                {user?.email || "Not provided"}
                            </dd>
                        </div>

                        <div className="flex justify-between items-center">
                            <dt className="text-sm md:text-lg font-medium text-muted-foreground">
                                Phone 1
                            </dt>
                            <dd className="text-sm md:text-lg">
                                {user?.phone || "Not provided"}
                            </dd>
                        </div>

                        <div className="flex justify-between items-center">
                            <dt className="text-sm md:text-lg font-medium text-muted-foreground">
                                Phone 2
                            </dt>
                            <dd className="text-sm md:text-lg">
                                {user?.phoneTwo || "Not provided"}
                            </dd>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 flex">
                        <Button
                            variant={"outline"}
                            onClick={() => setUserInfoForm(!userInfoForm)}
                            className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 border rounded-md hover:bg-accent hover:text-accent-foreground transition"
                        >
                            Edit info
                        </Button>
                    </div>
                </div>
            </section>

            {userInfoForm && <UpdateUserInfo />}
        </div>
    )
}

export default ProfileDetail