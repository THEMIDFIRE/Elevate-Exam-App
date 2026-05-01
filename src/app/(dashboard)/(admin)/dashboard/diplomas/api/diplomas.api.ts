import { mainApi } from "@/shared/lib/api/api";
import { Diplomas } from "@/shared/lib/types/diplomas";
import { getNextAuthToken } from "@/shared/lib/util/auth.util";
import { DiplomaInfo } from "../types/diplomaInfo";

type NewDiplomaPayload = {
    title: string;
    description: string;
    image: string;
}

export async function addNewDiploma(newDiploma: NewDiplomaPayload){
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Diplomas>(`/diplomas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newDiploma)
    })
    return res
}

export async function updateDiploma(newDiploma: Partial<NewDiplomaPayload>, diplomaId: string){
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Diplomas>(`/diplomas/${diplomaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newDiploma)
    })
    return res
}

export async function getDiplomaInfo(id: string): Promise<DiplomaInfo> {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<DiplomaInfo>(`/diplomas/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    return res
}


interface DeleteDiploma {
    message: string
}

export async function delDiploma(diplomaId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<DeleteDiploma>(`/diplomas/${diplomaId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return res
}

interface Immutability {
    message: string
}

export async function setDiplomaImmutability(diplomaId: string) {
    const jwt = await getNextAuthToken();
    const token = jwt?.accessToken;

    const res = await mainApi<Immutability>(`/admin/diplomas/${diplomaId}/immutable`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return res
}