import { handleCreateRequest,
        handleDeleteRequest,
        getAllReturn,
        handleGetAllRequest,
        handleGetRequest,
        handleUpdateRequest,
        createReturn,
        getReturn,
        updateDeleteReturn} from '../../utils/databaseConnection';
import { StatusType } from '../../utils/statusTypes';
import { CanCreate, CanDelete, CanExists, CanGet, CanGetAll, CanUpdate, DbCommon, DbNames } from '../common/tableInterface';

export class Instruction implements DbCommon {
    ID: number | undefined;
    createdTime: number;
    modifiedTime: number;
    description: string;

    constructor(description: string) {
        this.createdTime = Date.now();
        this.modifiedTime = this.createdTime;
        this.description = description;
    }
}

export const InstructionDbNames = {
    tableName: 'Instructions',
    messageName: 'Instruction',
    fieldName: 'instruction',
    multipleFieldName: 'instructions'
} as DbNames;

class InstructionDbInterface implements CanCreate<Instruction>,
                                CanGet<Instruction>,
                                CanGetAll<Instruction>,
                                CanExists,
                                CanUpdate<Instruction>,
                                CanDelete {

    async create(input: Instruction): Promise<createReturn> {
        return handleCreateRequest<Instruction>(input,
                                          InstructionDbNames.tableName,
                                          InstructionDbNames.messageName);
    }

    async get(id: number): Promise<getReturn<Instruction>> {
        return handleGetRequest(id, 
                                InstructionDbNames.tableName,
                                InstructionDbNames.messageName);
    }

    async getAll(): Promise<getAllReturn<Instruction>> {
        return handleGetAllRequest<Instruction>(InstructionDbNames.tableName,
                                          InstructionDbNames.messageName);
    }
    
    async exists(id: number): Promise<boolean> {
        const instructionResult = await this.get(id);
        return (instructionResult.status == StatusType.Success);
    }

    async update(id: number, record: Instruction): Promise<updateDeleteReturn> {
        return handleUpdateRequest<Instruction>(this.get,
                                            InstructionDbNames.tableName,
                                            InstructionDbNames.messageName,
                                            id,
                                            record);
    }

    async delete(id: number): Promise<updateDeleteReturn> {
        return handleDeleteRequest<Instruction>(this.get,
                                              InstructionDbNames.tableName,
                                              InstructionDbNames.messageName,
                                              id); 
    }
} 

export default InstructionDbInterface; 


