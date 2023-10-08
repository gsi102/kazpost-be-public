type ReportFileExt = "xlsx";
type ReportData = {
  accountId: string;
  from: {
    personFrom: string;
    phoneFrom: string;
    addressFrom: string;
    zipFrom: string;
  };
  to: {
    personTo: string;
    phoneTo: string;
    addressTo: string;
    zipTo: string;
  };
  price: string;
  payAmount: string;
};

export type { ReportFileExt, ReportData };
