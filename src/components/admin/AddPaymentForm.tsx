import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AppDispatch } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import { createPayment } from "@/utils/apis/adminPaymentApi";
import { toggleAddPaymentForm } from "@/store/slices/paymentSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePaymentFormData } from "@/types/entities/payment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddPaymentForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Omit<CreatePaymentFormData, 'customerId' | 'packageId'>>({
    customerName: "",
    packageName: "",
    totalAmount: 0,
    paidAmount: 0,
    paymentMethod: "googlepay",
    paymentDate: "",
    referenceId: "",
    paymentProof: "",
    adminNotes: "",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success("Payment created successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      dispatch(toggleAddPaymentForm());
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create payment");
    },
  });

  const resetForm = () => {
    setFormData({
      customerName: "",
      packageName: "",
      totalAmount: 0,
      paidAmount: 0,
      paymentMethod: "googlepay",
      paymentDate: "",
      referenceId: "",
      paymentProof: "",
      adminNotes: "",
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (formData.customerName.length < 2) {
      newErrors.customerName = "Customer name must be at least 2 characters";
    }

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Package name is required";
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be greater than 0";
    }

    if (formData.paidAmount < 0) {
      newErrors.paidAmount = "Paid amount cannot be negative";
    }

    if (formData.paidAmount > formData.totalAmount) {
      newErrors.paidAmount = "Paid amount cannot exceed total amount";
    }

    if (!formData.paymentDate.trim()) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (!formData.referenceId.trim()) {
      newErrors.referenceId = "Reference ID is required";
    } else if (formData.referenceId.length < 3) {
      newErrors.referenceId = "Reference ID must be at least 3 characters";
    }

    if (!formData.paymentProof.trim()) {
      newErrors.paymentProof = "Payment proof URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Add dummy ObjectIds when submitting to backend
      const paymentData: CreatePaymentFormData = {
        ...formData,
        customerId: "507f1f77bcf86cd799439011",
        packageId: "507f1f77bcf86cd799439012",
      };
      createMutation.mutate(paymentData);
    }
  };

  const handleCancel = () => {
    dispatch(toggleAddPaymentForm());
    resetForm();
  };

  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (field: 'totalAmount' | 'paidAmount', value: string) => {
    const numericValue = parseInt(value.replace(/,/g, '')) || 0;
    setFormData({ ...formData, [field]: numericValue });
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border  max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Add New Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Package Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className=""
              placeholder="Enter customer name"
            />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageName" className="">Package Name</Label>
            <Input
              id="packageName"
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              className=""
              placeholder="Enter package name"
            />
            {errors.packageName && <p className="text-red-500 text-sm mt-1">{errors.packageName}</p>}
          </div>
        </div>

        {/* Payment Amounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalAmount" className="">Total Amount (₹)</Label>
            <Input
              id="totalAmount"
              value={formatCurrency(formData.totalAmount.toString())}
              onChange={(e) => handleAmountChange('totalAmount', e.target.value)}
              className=""
              placeholder="50,000"
            />
            {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paidAmount" className="">Paid Amount (₹)</Label>
            <Input
              id="paidAmount"
              value={formatCurrency(formData.paidAmount.toString())}
              onChange={(e) => handleAmountChange('paidAmount', e.target.value)}
              className=""
              placeholder="20,000"
            />
            {errors.paidAmount && <p className="text-red-500 text-sm mt-1">{errors.paidAmount}</p>}
          </div>
        </div>

        {/* Balance Display */}
        {formData.totalAmount > 0 && (
          <div className="p-3 rounded-lg border">
            <span className="text-sm">Balance Amount: </span>
            <span className={`font-medium ${(formData.totalAmount - formData.paidAmount) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{formatCurrency((formData.totalAmount - formData.paidAmount).toString())}
            </span>
          </div>
        )}

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value: 'googlepay' | 'banktransfer' | 'cash') => 
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="googlepay">Google Pay</SelectItem>
                <SelectItem value="banktransfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate" className="">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className=""
            />
            {errors.paymentDate && <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referenceId" className="">Reference ID</Label>
            <Input
              id="referenceId"
              value={formData.referenceId}
              onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
              className=""
              placeholder="GP123456789"
            />
            {errors.referenceId && <p className="text-red-500 text-sm mt-1">{errors.referenceId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentProof" className="">Payment Proof URL</Label>
            <Input
              id="paymentProof"
              value={formData.paymentProof}
              onChange={(e) => setFormData({ ...formData, paymentProof: e.target.value })}
              className=""
              placeholder="https://drive.google.com/file/d/..."
            />
            {errors.paymentProof && <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="space-y-2">
          <Label htmlFor="adminNotes" className="">Admin Notes</Label>
          <Textarea
            id="adminNotes"
            value={formData.adminNotes}
            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
            className=""
            placeholder="Enter any additional notes..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentForm;