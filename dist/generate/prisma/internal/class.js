"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.2.0",
    "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider     = \"prisma-client\"\n  output       = \"../src/generate/prisma\"\n  moduleFormat = \"cjs\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\n// Enums (mapped to readable identifiers)\nenum UserRole {\n  admin\n  contractor\n  driver\n}\n\nenum VehicleWheel {\n  V4  @map(\"4\")\n  V6  @map(\"6\")\n  V10 @map(\"10\")\n  V12 @map(\"12\")\n}\n\nenum GoodsType {\n  HANDLE_WITH_CARE @map(\"handlewithcare\")\n  AUTOMOBILE       @map(\"automobile\")\n}\n\nenum VehicleCategory {\n  OPEN      @map(\"open\")\n  SEMIOPEN  @map(\"semiopen\")\n  CONTAINER @map(\"container\")\n}\n\nenum InsuranceType {\n  BASIC    @map(\"basic\")\n  PRO      @map(\"pro\")\n  MAXSAVER @map(\"maxsaver\")\n}\n\n// Models\nmodel User {\n  id                      Int           @id @default(autoincrement())\n  email                   String        @db.VarChar(100)\n  username                String        @db.VarChar(25)\n  role                    UserRole\n  password                String        @db.VarChar(100)\n  contact                 BigInt\n  regularPracticeLocation String\n  rating                  Float?\n  vechileType             VehicleType[] @relation(\"UserVehicles\")\n  contractsCreated        Contract[]    @relation(\"ContractorContracts\")\n  contractsCarried        Contract[]    @relation(\"GoodsCarrierContracts\")\n  bids                    Bid[]\n\n  @@map(\"user\")\n}\n\nmodel Contract {\n  id             Int          @id @default(autoincrement())\n  weight         Float\n  pickupDate     DateTime\n  dropDate       DateTime\n  startLocation  String       @db.VarChar(100)\n  endLocation    String       @db.VarChar(100)\n  approxKms      Int\n  contractorId   Int\n  goodsCarrierId Int?\n  typeOfVehicle  VehicleWheel\n  insured        Boolean\n  winningPrice   Int?\n  type           GoodsType\n  createdAt      DateTime     @default(now())\n  description    String       @default(\"\")\n  requirements   String[]     @default([])\n  contractor     User         @relation(\"ContractorContracts\", fields: [contractorId], references: [id], onDelete: Cascade)\n  goodsCarrier   User?        @relation(\"GoodsCarrierContracts\", fields: [goodsCarrierId], references: [id], onDelete: Cascade)\n  bids           Bid[]\n\n  insurance Insurance?\n\n  @@map(\"contract\")\n}\n\nmodel Bid {\n  id         Int @id @default(autoincrement())\n  userId     Int\n  contractId Int\n  amount     Int\n\n  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  contract Contract @relation(fields: [contractId], references: [id], onDelete: Cascade)\n\n  @@map(\"bids\")\n}\n\nmodel VehicleType {\n  id                Int             @id @default(autoincrement())\n  wheelers          VehicleWheel\n  category          VehicleCategory\n  brand             String          @db.VarChar(50)\n  insuranceValidity Boolean\n  driverId          Int\n  driver            User            @relation(\"UserVehicles\", fields: [driverId], references: [id], onDelete: Cascade)\n\n  @@map(\"vechiletype\")\n}\n\nmodel Insurance {\n  id         Int           @id @default(autoincrement())\n  contractId Int           @unique\n  type       InsuranceType\n  premium    Float\n\n  contract Contract @relation(fields: [contractId], references: [id], onDelete: Cascade)\n\n  @@map(\"insurance\")\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"UserRole\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contact\",\"kind\":\"scalar\",\"type\":\"BigInt\"},{\"name\":\"regularPracticeLocation\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"vechileType\",\"kind\":\"object\",\"type\":\"VehicleType\",\"relationName\":\"UserVehicles\"},{\"name\":\"contractsCreated\",\"kind\":\"object\",\"type\":\"Contract\",\"relationName\":\"ContractorContracts\"},{\"name\":\"contractsCarried\",\"kind\":\"object\",\"type\":\"Contract\",\"relationName\":\"GoodsCarrierContracts\"},{\"name\":\"bids\",\"kind\":\"object\",\"type\":\"Bid\",\"relationName\":\"BidToUser\"}],\"dbName\":\"user\"},\"Contract\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"weight\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"pickupDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"dropDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"startLocation\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"endLocation\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"approxKms\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"contractorId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"goodsCarrierId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"typeOfVehicle\",\"kind\":\"enum\",\"type\":\"VehicleWheel\"},{\"name\":\"insured\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"winningPrice\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"GoodsType\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"requirements\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contractor\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ContractorContracts\"},{\"name\":\"goodsCarrier\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"GoodsCarrierContracts\"},{\"name\":\"bids\",\"kind\":\"object\",\"type\":\"Bid\",\"relationName\":\"BidToContract\"},{\"name\":\"insurance\",\"kind\":\"object\",\"type\":\"Insurance\",\"relationName\":\"ContractToInsurance\"}],\"dbName\":\"contract\"},\"Bid\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"contractId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BidToUser\"},{\"name\":\"contract\",\"kind\":\"object\",\"type\":\"Contract\",\"relationName\":\"BidToContract\"}],\"dbName\":\"bids\"},\"VehicleType\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"wheelers\",\"kind\":\"enum\",\"type\":\"VehicleWheel\"},{\"name\":\"category\",\"kind\":\"enum\",\"type\":\"VehicleCategory\"},{\"name\":\"brand\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"insuranceValidity\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"driverId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"driver\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserVehicles\"}],\"dbName\":\"vechiletype\"},\"Insurance\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"contractId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"InsuranceType\"},{\"name\":\"premium\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"contract\",\"kind\":\"object\",\"type\":\"Contract\",\"relationName\":\"ContractToInsurance\"}],\"dbName\":\"insurance\"}},\"enums\":{},\"types\":{}}");
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await Promise.resolve().then(() => __importStar(require('node:buffer')));
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_bg.postgresql.js"))),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.js")));
        return await decodeBase64AsWasm(wasm);
    }
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map