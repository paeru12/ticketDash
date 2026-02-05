import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/common/RichTextEditor";
import TagInput from "../ui/tagsinput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCreator } from "@/lib/creatorApi";
import { getProvinces, getRegencies } from "@/lib/regionApi";
import { getCategory } from "@/lib/categoryApi";
import DropdownSearch from "@/components/ui/DropdownSearch";

export default function EventStepOne({
  data,
  onChange,
  onNext = () => { },
  onCancel = () => { },
  readOnly = false,
  hideAction = false,
  isEdit = false,
}) {
  const [showError, setShowError] = useState(false);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);

  useEffect(() => {
    async function fetchMasterData() {
      try {
        setLoadingMaster(true);

        const [orgRes, catRes] = await Promise.all([
          getCreator(),
          getCategory(),
        ]);

        setOrganizers(orgRes.data?.data || orgRes.data || []);
        setCategories(catRes.data?.data || catRes.data || []);

      } catch (err) {
        console.error("Gagal load master data", err);
      } finally {
        setLoadingMaster(false);
      }
    }

    fetchMasterData();
    loadProvinces();
  }, []);

  // 1. Map province name to provinceCode when provinces are loaded
  useEffect(() => {
    if (isEdit && data.province && provinces.length > 0 && !data.provinceCode) {
      const prov = provinces.find(p => p.name === data.province);
      if (prov) {
        onChange({ ...data, provinceCode: prov.code });
      }
    }
  }, [isEdit, provinces, data.province, data.provinceCode]);

  // 2. Load regencies whenever provinceCode is set (either from initial map or user selection)
  useEffect(() => {
    async function loadRegencies() {
      if (data.provinceCode) {
        try {
          const res = await getRegencies(data.provinceCode);
          const regList = res.data.data.data || [];
          setRegencies(regList);

          // 3. Map district name to regencyCode once regencies are loaded
          if (isEdit && data.district && !data.regencyCode) {
            const reg = regList.find(r => r.name === data.district);
            if (reg) {
              onChange({ ...data, regencyCode: reg.code });
            }
          }
        } catch (err) {
          console.error("Gagal load kabupaten", err);
        }
      }
    }
    loadRegencies();
  }, [data.provinceCode, isEdit, data.district, data.regencyCode]);


  async function loadProvinces() {
    try {
      const res = await getProvinces();
      console.log(res);
      setProvinces(res.data.data.data || []);
    } catch (err) {
      console.error("Gagal load provinsi", err);
    }
  }

  const [organizers, setOrganizers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(false);

  const refs = {
    flyer: useRef(null),
    name: useRef(null),
    creatorId: useRef(null),
    location: useRef(null),
    category: useRef(null),
    status: useRef(null),
    startDate: useRef(null),
    endDate: useRef(null),
    startTime: useRef(null),
    endTime: useRef(null),
    timezone: useRef(null),
    description: useRef(null),
    terms: useRef(null),
    keywords: useRef(null),
  };

  function upload(file, key) {
    if (!file) return;

    onChange({
      ...data,
      [key]: file, // 🔥 FILE ASLI
      [`${key}Preview`]: URL.createObjectURL(file), // 👁️ preview
    });
  }


  const isFieldInvalid = (key, value) => {
    switch (key) {
      case "keywords":
        return !Array.isArray(value) || value.length === 0;

      case "flyer":
        if (isEdit) {
          return !data.flyerPreview && !data.flyer;
        }
        return !value;


      case "description":
      case "terms":
        return !value || value.replace(/<(.|\n)*?>/g, "").trim() === "";

      default:
        return value === undefined || value === "";
    }
  };

  function handleNext() {
    const requiredFields = [
      "flyer",
      "name",
      "creatorId",
      "location",
      "category",
      "status",
      "startDate",
      "endDate",
      "startTime",
      "endTime",
      "timezone",
      "description",
      "terms",
      "keywords"
    ];
    if (!isEdit) {
      requiredFields.unshift("flyer");
    }

    for (const key of requiredFields) {
      if (isFieldInvalid(key, data[key])) {
        setShowError(true);
        refs[key]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        return;
      }
    }

    if (typeof onNext === "function") {
      onNext();
    }
  }

  const errorClass = (key) =>
    showError && isFieldInvalid(key, data[key]) ? "border-red-400" : "";


  return (
    <div className="space-y-6 px-4">
      {showError && (
        <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-700 rounded">
          Lengkapi semua field yang wajib diisi
        </div>
      )}

      <h2 className="text-lg font-semibold">{isEdit ? "" : "Event – Step 1"}</h2>
      <div className="overflow-y-auto grid gap-3 p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
          {/* Flyer */}
          <div ref={refs.flyer} className="w-full">
            <label className="text-sm font-medium">
              Flyer Event <span className="text-red-500">*</span>
            </label>

            <label
              className={`
              flex h-40 w-full items-center justify-center cursor-pointer rounded-lg border-2 border-dashed
              ${showError && isFieldInvalid("flyer", data.flyer)
                  ? "border-red-500 bg-red-50"
                  : "border-slate-300"
                }
            `}
            >

              {data.flyerPreview ? (
                <img
                  src={data.flyerPreview}
                  className="max-h-full object-contain"
                />
              ) : (
                <span className="text-sm text-slate-500">Upload flyer</span>
              )}

              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => upload(e.target.files[0], "flyer")}
              />

            </label>
          </div>


          {/* Layout */}
          <div className="w-full">
            <label className="text-sm font-medium">Layout Event</label>
            <label className={`flex h-40 border-2 border-dashed rounded-lg items-center justify-center cursor-pointer`}>
              {data.layoutPreview ? (
                <img src={data.layoutPreview} className="max-h-full object-contain" />
              ) : (
                <span className="text-sm text-slate-500">Upload layout</span>
              )}
              <Input type="file" disabled={readOnly} className="hidden" onChange={e => !readOnly && upload(e.target.files[0], "layout")} />
            </label>
          </div>
        </div>

        <div ref={refs.name}>
          <label className="text-sm font-medium">Nama Event <span className="text-red-500">*</span></label>
          <Input
            value={data.name || ""}
            disabled={readOnly}
            placeholder="Nama Event"
            className={errorClass("name") || ""}
            onChange={e => !readOnly && onChange({ ...data, name: e.target.value })}
          />
        </div>

        <div ref={refs.creatorId} className="flex gap-4 items-end">
          <div className="flex-grow">
            <label className="text-sm font-medium">Organizer <span className="text-red-500">*</span></label>
            <select
              className={`border rounded px-3 py-2 capitalize w-full ${showError && !data.creatorId ? "border-red-500" : ""
                }`}
              value={data.creatorId || ""}
              disabled={readOnly || loadingMaster}
              onChange={(e) =>
                !readOnly && onChange({ ...data, creatorId: e.target.value })
              }
            >
              <option value="">
                {loadingMaster ? "Loading organizer..." : "Pilih Organizer"}
              </option>

              {organizers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>

          </div>
          <div className="flex-none">
            <Button
              onClick={() => setOpen(true)}
              type="button">
              Add Organizer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div ref={refs.location}>
            <label className="text-sm font-medium">Location <span className="text-red-500">*</span></label>
            <Input
              value={data.location}
              disabled={readOnly}
              className={showError && !data.location ? "border-red-400" : ""}
              onChange={e => !readOnly && onChange({ ...data, location: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Map(URL)</label>
            <Input
              value={data.mapUrl || ""}
              disabled={readOnly}
              placeholder="Link Google Maps"
              onChange={e => !readOnly && onChange({ ...data, mapUrl: e.target.value })}
            />
          </div>

          <DropdownSearch
            label="Provinsi"
            items={provinces}
            value={data.provinceCode}
            itemKey="code"
            itemLabel="name"
            buttonPlaceholder="Pilih Provinsi"
            disabled={loadingMaster || readOnly}
            onSelect={async (provCode) => {
              const selected = provinces.find(p => p.code === provCode);

              onChange({
                ...data,
                province: selected?.name || "",   // SIMPAN ke DB
                provinceCode: provCode,           // untuk dropdown saja
                district: "",                     // reset ketika ganti provinsi
                regencyCode: ""
              });

              const res = await getRegencies(provCode);
              setRegencies(res.data.data.data || []);
            }}

          />

          <DropdownSearch
            label="Kabupaten / Kota"
            items={regencies}
            value={data.regencyCode}
            itemKey="code"
            itemLabel="name"
            buttonPlaceholder="Pilih Kabupaten/Kota"
            disabled={!data.province || loadingMaster || readOnly}
            onSelect={(regCode) => {
              const selected = regencies.find(r => r.code === regCode);

              onChange({
                ...data,
                district: selected?.name || "",    // SIMPAN ke DB
                regencyCode: regCode               // untuk dropdown saja
              });
            }}

          />

          <div ref={refs.category}>
            <label className="text-sm font-medium">Kategori <span className="text-red-500">*</span></label>

            <select
              className={`w-full border rounded p-2 capitalize ${errorClass("category") || ""}`}
              value={data.category || ""}
              disabled={readOnly || loadingMaster}
              onChange={(e) =>
                !readOnly && onChange({ ...data, category: e.target.value })
              }
            >
              <option value="">
                {loadingMaster ? "Loading kategori..." : "Pilih Kategori"}
              </option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div ref={refs.startRef}>
            <label className="text-sm font-medium">Tanggal Mulai <span className="text-red-500">*</span></label>
            <Input
              type="date"
              disabled={readOnly}
              value={data.startDate || ""}
              className={errorClass("startDate") || ""}
              onChange={e => !readOnly && onChange({ ...data, startDate: e.target.value })}
            />
          </div>

          <div ref={refs.startTime}>
            <label className="text-sm font-medium">Jam Mulai <span className="text-red-500">*</span></label>
            <Input
              type="time"
              disabled={readOnly}
              value={data.startTime || ""}
              className={errorClass("startTime") || ""}
              onChange={e => !readOnly && onChange({ ...data, startTime: e.target.value })}
            />
          </div>

          <div ref={refs.endRef}>
            <label className="text-sm font-medium">Tanggal Berakhir <span className="text-red-500">*</span></label>
            <Input
              type="date"
              disabled={readOnly}
              value={data.endDate || ""}
              className={errorClass("endDate") || ""}
              onChange={e => !readOnly && onChange({ ...data, endDate: e.target.value })}
            />
          </div>

          <div ref={refs.endTime}>
            <label className="text-sm font-medium">Jam Berakhir <span className="text-red-500">*</span></label>
            <Input
              type="time"
              disabled={readOnly}
              value={data.endTime || ""}
              className={errorClass("endTime") || ""}
              onChange={e => !readOnly && onChange({ ...data, endTime: e.target.value })}
            />
          </div>

          <div ref={refs.timezone}>
            <label className="text-sm font-medium">Zona Waktu<span className="text-red-500">*</span></label>

            <select
              className={`w-full border rounded p-2 ${errorClass("timezone") || ""}`}
              value={data.timezone || ""}
              disabled={readOnly}
              onChange={e => !readOnly && onChange({ ...data, timezone: e.target.value })}
            >
              <option value="">Pilih Zona Waktu</option>
              <option value="WIB">WIB</option>
              <option value="WITA">WITA</option>
              <option value="WIT">WIT</option>
            </select>
          </div>

          {/* STATUS */}
          <div ref={refs.status}>
            <label className="text-sm font-medium">Status <span className="text-red-500">*</span></label>
            <select
              className={`w-full border rounded p-2 ${errorClass("status") || ""}`}
              disabled={readOnly}
              value={data.status || ""}
              onChange={e => !readOnly && onChange({ ...data, status: e.target.value })}
            >
              <option value="">Pilih Status</option>
              <option value={"published"}>Published</option>
              <option value={"draft"}>Draft</option>
            </select>
          </div>
        </div>

        <div ref={refs.description}>
          <label className="text-sm font-medium">
            Deskripsi Event <span className="text-red-500">*</span>
          </label>

          <div
            className={`
            rounded-lg transition-all
            ${showError && isFieldInvalid("description", data.description)
                ? "border border-red-500 ring-1 ring-red-300"
                : "border border-slate-300 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent"
              }
            ${readOnly ? "pointer-events-none bg-slate-50" : "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent"}
          `}
          >
            <RichTextEditor
              value={data.description || ""}
              readOnly={readOnly}
              onChange={(v) =>
                !readOnly && onChange({ ...data, description: v })
              }
            />
          </div>
        </div>

        <div ref={refs.terms}>
          <label className="text-sm font-medium">
            Syarat & Ketentuan Event <span className="text-red-500">*</span>
          </label>

          <div
            className={`
            rounded-lg transition-all
            ${showError && isFieldInvalid("terms", data.terms)
                ? "border border-red-500 ring-1 ring-red-300"
                : "border border-slate-300 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent"
              }
            ${readOnly ? "pointer-events-none bg-slate-50" : "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent"}
          `}
          >
            <RichTextEditor
              value={data.terms || ""}
              readOnly={readOnly}
              onChange={(v) =>
                !readOnly && onChange({ ...data, terms: v })
              }
            />
          </div>
        </div>

        <div ref={refs.keywords}>
          <label className="text-sm font-medium">Keywords <span className="text-red-500">*</span></label>
          <TagInput
            keywords={data.keywords || []}
            setKeywords={(newTags) =>
              !readOnly && onChange({ ...data, keywords: newTags })
            }
            maxKeywords={20}
            readOnly={readOnly}
            error={showError && isFieldInvalid("keywords", data.keywords)}
          />

        </div>
      </div>

      {!hideAction && (
        <div className="flex justify-end py-6">

          <Button
            type="button"
            onClick={handleNext}
          >
            {isEdit ? "Update" : "Next"}
          </Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Organizer</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            const newOrg = { id: Date.now().toString(), name: name.trim(), description: desc.trim() };
            setOrganizers(prev => [...prev, newOrg]);
            onChange({ ...data, creatorId: newOrg.id }); // Langsung simpan ke data utama
            setName(""); setDesc(""); setData("WIB"); setOpen(false);
          }}>
            <div>
              <label className="block text-sm mb-1">Nama Organizer <span className="text-red-500">*</span></label>
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="w-full">
              <label className="text-sm font-medium">Gambar <span className="text-red-500">*</span></label>
              <label className={`flex h-40 border-2 border-dashed rounded-lg items-center justify-center cursor-pointer`}>
                {data.gambarOr ? (
                  <img src={data.gambarOr} className="max-h-full object-contain" />
                ) : (
                  <span className="text-sm text-slate-500">Upload Gambar</span>
                )}
                <Input type="file" disabled={readOnly} className="hidden" onChange={e => !readOnly && upload(e.target.files[0], "gambarOr")} />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}