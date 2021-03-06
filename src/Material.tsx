import * as THREE from "three"
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RawShaderMaterial } from "three"
import { vertexShader } from "./shaders/vertex"
import { fragmentShader } from "./shaders/fragment"

const Material = ({ texture }: any) => {
  const { image } = texture
  const ref = useRef<RawShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uTexture: { value: texture },
      uTextureSize: { value: new THREE.Vector2(image.width, image.height) },
    }),
    [texture, image]
  )

  useFrame(({ clock, mouse }) => {
    ref.current.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <rawShaderMaterial
      ref={ref}
      uniforms={uniforms}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
      blending={THREE.AdditiveBlending}
    />
  )
}

export default Material
