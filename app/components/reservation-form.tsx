import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ALERGIAS,
  BEBIDAS,
  GUESTS,
  POSTRES,
  PRINCIPALES,
} from "~/lib/data";
import type { ReservationInput } from "~/lib/schema";
import {
  getReservationByName,
  upsertReservation,
} from "~/server/reservations";
import { WhatsAppIcon } from "./icons";

type FormValues = ReservationInput;

const emptyDefaults: FormValues = {
  guestName: "" as ReservationInput["guestName"],
  principal: "" as ReservationInput["principal"],
  postre: "" as ReservationInput["postre"],
  bebida: "" as ReservationInput["bebida"],
  alergiasChips: [],
  alergiasOtras: "",
  nota: "",
};

export function ReservationForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [guestName, setGuestName] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    watch,
  } = useForm<FormValues>({
    defaultValues: emptyDefaults,
    mode: "onSubmit",
  });

  const prefill = useQuery({
    queryKey: ["reservation", guestName],
    queryFn: () => getReservationByName({ data: { guestName } }),
    enabled: guestName.length > 0,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (prefill.data) {
      reset(prefill.data);
    } else if (guestName) {
      reset({
        ...emptyDefaults,
        guestName: guestName as FormValues["guestName"],
      });
    }
  }, [prefill.data, guestName, reset]);

  const submit = useMutation({
    mutationFn: (values: FormValues) => upsertReservation({ data: values }),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["reservation", guestName] });
      navigate({
        to: "/gracias",
        search: { updated: result.isUpdate },
      });
    },
  });

  const isBusy = submit.isPending;
  const wasPrefilled = !!prefill.data;

  const alergiasChips = watch("alergiasChips") ?? [];

  return (
    <form
      className="card flex flex-col gap-7"
      noValidate
      onSubmit={handleSubmit((values) => submit.mutate(values))}
    >
      <h2 className="section-title">Tu elección</h2>

      {wasPrefilled ? (
        <p className="rounded-lg border border-dashed border-olive/60 bg-card-light px-4 py-3 text-center font-serif italic text-[14px] text-ink-2">
          Ya habías reservado. Hemos rellenado tus respuestas anteriores. Puedes
          cambiarlas y volver a enviar. ✏️
        </p>
      ) : null}

      <div className="flex flex-col gap-2.5">
        <label htmlFor="nombre" className="field-label">
          ¿Quién eres?<span className="ml-1 text-terracotta">*</span>
        </label>
        <div className="relative">
          <select
            id="nombre"
            className="field-input appearance-none cursor-pointer pr-11"
            {...register("guestName", { required: true })}
            onChange={(e) => {
              setValue(
                "guestName",
                e.target.value as FormValues["guestName"],
                { shouldValidate: false },
              );
              setGuestName(e.target.value);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Elige tu nombre…
            </option>
            {GUESTS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 text-terracotta">
            ▾
          </span>
        </div>
        <FieldError message={errors.guestName?.message} />
      </div>

      <fieldset className="flex flex-col gap-2.5 border-0 p-0">
        <legend className="field-label">
          Principal<span className="ml-1 text-terracotta">*</span>
        </legend>
        <p className="field-hint">Elige uno.</p>
        <Controller
          control={control}
          name="principal"
          rules={{ required: "Elige un principal." }}
          render={({ field }) => (
            <div
              className="chips-stack flex flex-col gap-2"
              role="radiogroup"
              aria-label="Elige un principal"
            >
              {PRINCIPALES.map((p) => (
                <label key={p.value} className="chip">
                  <input
                    type="radio"
                    value={p.value}
                    checked={field.value === p.value}
                    onChange={() => field.onChange(p.value)}
                  />
                  <span className="chip-face">
                    <span className="name">{p.value}</span>
                    {p.supp ? <span className="supp">{p.supp}</span> : null}
                  </span>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.principal?.message} />
      </fieldset>

      <fieldset className="flex flex-col gap-2.5 border-0 p-0">
        <legend className="field-label">
          Postre<span className="ml-1 text-terracotta">*</span>
        </legend>
        <Controller
          control={control}
          name="postre"
          rules={{ required: "Elige un postre." }}
          render={({ field }) => (
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Elige un postre"
            >
              {POSTRES.map((p) => (
                <label key={p} className="chip">
                  <input
                    type="radio"
                    value={p}
                    checked={field.value === p}
                    onChange={() => field.onChange(p)}
                  />
                  <span className="chip-face">
                    <span className="name">{p}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.postre?.message} />
      </fieldset>

      <fieldset className="flex flex-col gap-2.5 border-0 p-0">
        <legend className="field-label">
          Bebida<span className="ml-1 text-terracotta">*</span>
        </legend>
        <p className="field-hint">Todo incluido en el menú.</p>
        <Controller
          control={control}
          name="bebida"
          rules={{ required: "Elige una bebida." }}
          render={({ field }) => (
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Elige una bebida"
            >
              {BEBIDAS.map((b) => (
                <label key={b} className="chip">
                  <input
                    type="radio"
                    value={b}
                    checked={field.value === b}
                    onChange={() => field.onChange(b)}
                  />
                  <span className="chip-face">
                    <span className="name">{b}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.bebida?.message} />
      </fieldset>

      <fieldset className="flex flex-col gap-2.5 border-0 p-0">
        <legend className="field-label">Alergias e intolerancias</legend>
        <p className="field-hint">
          Marca todo lo que aplique. Déjalo en blanco si no tienes ninguna.
        </p>
        <Controller
          control={control}
          name="alergiasChips"
          render={({ field }) => (
            <div className="chips-allergies flex flex-wrap gap-2">
              {ALERGIAS.map((a) => {
                const checked = field.value?.includes(a) ?? false;
                return (
                  <label key={a} className="chip">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const current = field.value ?? [];
                        field.onChange(
                          e.target.checked
                            ? [...current, a]
                            : current.filter((x) => x !== a),
                        );
                      }}
                    />
                    <span className="chip-face">
                      <span className="name">{a}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        />
        <textarea
          className="field-input mt-2.5"
          placeholder="¿Alguna otra alergia, intolerancia o preferencia? Escríbelo aquí."
          rows={3}
          {...register("alergiasOtras")}
        />
      </fieldset>

      <div className="flex flex-col gap-2.5">
        <label htmlFor="nota" className="field-label">
          Mensajito para el cumpleañero
        </label>
        <p className="field-hint">Opcional. Un chiste malo también vale.</p>
        <textarea
          id="nota"
          className="field-input"
          placeholder="Ej. ¡Felicidades, Víctor! 🎉"
          rows={3}
          {...register("nota")}
        />
      </div>

      {submit.error ? (
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-terracotta-dark">
          Algo falló al enviar: {submit.error.message}
        </p>
      ) : null}

      <div className="mt-1 flex flex-col items-center gap-3.5">
        <button type="submit" className="send-btn" disabled={isBusy}>
          <WhatsAppIcon className="h-[22px] w-[22px]" />
          {isBusy ? "Enviando…" : wasPrefilled ? "Actualizar" : "Enviar"}
        </button>
        <p className="text-center font-serif italic text-[13px] text-ink-mute">
          {alergiasChips.length > 0
            ? `Marcadas: ${alergiasChips.length} alergia${alergiasChips.length === 1 ? "" : "s"}.`
            : "Sin alergias marcadas."}
        </p>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-terracotta-dark">
      {message}
    </p>
  );
}
