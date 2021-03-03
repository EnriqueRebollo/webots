// Copyright 1996-2021 Cyberbotics Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {arrayXPointer} from './../nodes/wbUtils.js';

class WbWrenShaders {
  static buildShader(shader, vertexShaderPath, fragmentShaderpath) {
    Module.ccall('wr_shader_program_set_vertex_shader_path', null, ['number', 'string'], [shader, vertexShaderPath]);
    Module.ccall('wr_shader_program_set_fragment_shader_path', null, ['number', 'string'], [shader, fragmentShaderpath]);
    _wr_shader_program_setup(shader);

    if (!_wr_shader_program_get_gl_name(shader)) {
      console.error('Shader Error');
      if (_wr_shader_program_has_vertex_shader_compilation_failed(shader))
        console.error('Vertex shader compilation failed');
      else if (_wr_shader_program_has_fragment_shader_compilation_failed(shader))
        console.error('Fragment shader compilation failed');
      else
        console.error('Linkage failed');
    }
  }

  static async buildAll() {
    WbWrenShaders.phongShader();
    WbWrenShaders.phongStencilAmbientEmissiveShader();
    WbWrenShaders.phongStencilDiffuseSpecularShader();
    WbWrenShaders.pbrShader();
    WbWrenShaders.pbrStencilAmbientEmissiveShader();
    WbWrenShaders.pbrStencilDiffuseSpecularShader();
    WbWrenShaders.fogShader();
    WbWrenShaders.iblBrdfBakingShader();
    WbWrenShaders.shadowVolumeShader();
    WbWrenShaders.hdrResolveShader();
    WbWrenShaders.hdrClearShader();
    WbWrenShaders.skyboxShader();
    WbWrenShaders.passThroughShader();
    WbWrenShaders.iblSpecularIrradianceBakingShader();
    WbWrenShaders.gtaoShader();
    WbWrenShaders.gtaoSpatialDenoiseShader();
    WbWrenShaders.gtaoTemporalDenoiseShader();
    WbWrenShaders.gtaoCombineShader();
    WbWrenShaders.brightPassShader();
    WbWrenShaders.gaussianBlur13TapShader();
    WbWrenShaders.bloomBlendShader();
    WbWrenShaders.lineSetShader();
    WbWrenShaders.smaaEdgeDetectionShader();
    WbWrenShaders.smaaBlendingWeightCalculationShader();
    WbWrenShaders.smaaFinalBlendShader();
    WbWrenShaders.pointSetShader();
    WbWrenShaders.pickingShader();
    WbWrenShaders.depthPixelShader();
  }

  static defaultShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0); // main texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1); // pen texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2); // background texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT], '../../../resources/wren/shaders/default.vert', '../../../resources/wren/shaders/default.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEFAULT];
  }

  static phongShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0); // main texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1); // pen texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2); // background texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHTS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_FOG);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG], '../../../resources/wren/shaders/phong.vert', '../../../resources/wren/shaders/phong.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG];
  }

  static phongStencilAmbientEmissiveShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0); // main texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1); // pen texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2); // background texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHTS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE], '../../../resources/wren/shaders/phong_stencil_ambient_emissive.vert', '../../../resources/wren/shaders/phong_stencil_ambient_emissive.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE];
  }

  static phongStencilDiffuseSpecularShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);// main texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);// pen texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2);// background texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHTS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHT_RENDERABLE);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR], '../../../resources/wren/shaders/phong_stencil_diffuse_specular.vert', '../../../resources/wren/shaders/phong_stencil_diffuse_specular.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR];
  }

  static pbrShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0); // base color texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1); // roughness texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2); // metalness texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE3); // occlusion map
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE4); // normal map
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE5); // BRDF LUT
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE6); // emissive texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE7); // background texture (for displays)
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE8); // pen texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_CUBE0); // irradiance cubemap
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PBR);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHTS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_FOG);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR], '../../../resources/wren/shaders/pbr.vert', '../../../resources/wren/shaders/pbr.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR];
  }

  static pbrStencilAmbientEmissiveShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE] = _wr_shader_program_new();

      // base color texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      // roughness texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      // metalness texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2);
      // occlusion map
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE3);
      // normal map
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE4);
      // BRDF LUT
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE5);
      // emissive texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE6);
      // background texture (for displays)
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE7);
      // pen texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE8);
      // irradiance cubemap
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_CUBE0);
      // specular cubemap
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PBR);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE], '../../../resources/wren/shaders/pbr_stencil_ambient_emissive.vert', '../../../resources/wren/shaders/pbr_stencil_ambient_emissive.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_AMBIENT_EMISSIVE];
  }

  static pbrStencilDiffuseSpecularShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR] = _wr_shader_program_new();

      // base color texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      // roughness texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      // metalness texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2);
      // occlusion map
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE3);
      // normal map
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE4);
      // background texture (for displays)
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE7);
      // pen texture
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE8);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PBR);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHTS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHT_RENDERABLE);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR], '../../../resources/wren/shaders/pbr_stencil_diffuse_specular.vert', '../../../resources/wren/shaders/pbr_stencil_diffuse_specular.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PBR_STENCIL_DIFFUSE_SPECULAR];
  }

  static encodeDepthShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      const minRange = 0.0;
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH], 'minRange', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_FLOAT, _wrjs_pointerOnFloat(minRange)]);

      const maxRange = 1.0;
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH], 'maxRange', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_FLOAT, _wrjs_pointerOnFloat(maxRange)]);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH], '../../../resources/wren/shaders/encode_depth.vert', '../../../resources/wren/shaders/encode_depth.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_ENCODE_DEPTH];
  }

  static fogShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_FOG]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_FOG] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_FOG], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_FOG], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_FOG], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_FOG);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_FOG], '../../../resources/wren/shaders/fog.vert', '../../../resources/wren/shaders/fog.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_FOG];
  }

  static iblBrdfBakingShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_BRDF_BAKE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_BRDF_BAKE] = _wr_shader_program_new();

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_BRDF_BAKE], '../../../resources/wren/shaders/bake_brdf.vert', '../../../resources/wren/shaders/bake_brdf.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_BRDF_BAKE];
  }

  static shadowVolumeShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHTS);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_LIGHT_RENDERABLE);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME], '../../../resources/wren/shaders/shadow_volume.vert', '../../../resources/wren/shaders/shadow_volume.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SHADOW_VOLUME];
  }

  static hdrResolveShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_RESOLVE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_RESOLVE] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_RESOLVE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);

      const defaultExposureValue = 1.0;
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_RESOLVE], 'exposure', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_FLOAT, _wrjs_pointerOnFloat(defaultExposureValue)]);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_RESOLVE], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/hdr_resolve.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_RESOLVE];
  }

  static hdrClearShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_CLEAR]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_CLEAR] = _wr_shader_program_new();

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_CLEAR], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_CLEAR], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/hdr_clear.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_HDR_CLEAR];
  }

  static skyboxShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SKYBOX]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SKYBOX] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SKYBOX], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_CUBE0);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SKYBOX], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SKYBOX], '../../../resources/wren/shaders/skybox.vert', '../../../resources/wren/shaders/skybox.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SKYBOX];
  }

  static passThroughShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PASS_THROUGH]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PASS_THROUGH] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PASS_THROUGH], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PASS_THROUGH], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/pass_through.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PASS_THROUGH];
  }

  static iblSpecularIrradianceBakingShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE] = _wr_shader_program_new();

      const projectionAndViewDefaults = new Array(16).fill(0.0);
      const projectionAndViewDefaultsPointer = arrayXPointer(projectionAndViewDefaults);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE], 'projection', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_MAT4F, projectionAndViewDefaultsPointer]);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE], 'view', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_MAT4F, projectionAndViewDefaultsPointer]);

      const roughness = 0.0;
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE], 'roughness', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_FLOAT, _wrjs_pointerOnFloat(roughness)]);

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE_CUBE0);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE], '../../../resources/wren/shaders/bake_cubemap.vert', '../../../resources/wren/shaders/bake_specular_cubemap.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_IBL_SPECULAR_IRRADIANCE_BAKE];
  }

  static gtaoShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], ENUM.WR_GLSL_LAYOUT_UNIFORM_VIEWPORT_SIZE);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      const paramsPointer = _wrjs_array4(0, 0, 0, 0);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], 'params', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_VEC4F, paramsPointer]);

      const clipInfoPointer = _wrjs_array4(0.0, 1000000.0, 0.0, 0.0);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], 'clipInfo', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_VEC4F, clipInfoPointer]);

      const radiusPointer = _wrjs_pointerOnFloat(2.0);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], 'radius', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_FLOAT, radiusPointer]);

      const flipNormalYPointer = _wrjs_pointerOnFloat(0.0);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], 'flipNormalY', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_FLOAT, flipNormalYPointer]);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/gtao.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO];
  }

  static gtaoSpatialDenoiseShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_SPATIAL_DENOISE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_SPATIAL_DENOISE] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_SPATIAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_SPATIAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_SPATIAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_SPATIAL_DENOISE], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/gtao_spatial_denoise.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_SPATIAL_DENOISE];
  }

  static gtaoTemporalDenoiseShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE3);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      const previousInverseViewMatrix = new Array(16).fill(0.0);
      const previousInverseViewMatrixPointer = arrayXPointer(previousInverseViewMatrix);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE], 'previousInverseViewMatrix', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_MAT4F, previousInverseViewMatrixPointer]);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/gtao_temporal_denoise.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_TEMPORAL_DENOISE];
  }

  static gtaoCombineShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_COMBINE]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_COMBINE] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_COMBINE], 0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_COMBINE], 1);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_COMBINE], 2);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_COMBINE], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/gtao_combine.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GTAO_COMBINE];
  }

  static brightPassShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BRIGHT_PASS]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BRIGHT_PASS] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BRIGHT_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);

      const defaultThresholdPointer = _wrjs_pointerOnFloat(10.0);
      Module.ccall('wr_shader_program_create_custom_uniform', null, ['number', 'string', 'number', 'number'], [WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BRIGHT_PASS], 'threshold', ENUM.WR_SHADER_PROGRAM_UNIFORM_TYPE_FLOAT, defaultThresholdPointer]);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BRIGHT_PASS], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/bright_pass.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BRIGHT_PASS];
  }

  static gaussianBlur13TapShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GAUSSIAN_BLUR_13_TAP]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GAUSSIAN_BLUR_13_TAP] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GAUSSIAN_BLUR_13_TAP], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GAUSSIAN_BLUR_13_TAP], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GAUSSIAN_BLUR_13_TAP], ENUM.WR_GLSL_LAYOUT_UNIFORM_ITERATION_NUMBER);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GAUSSIAN_BLUR_13_TAP], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/gaussian_blur_13_tap.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_GAUSSIAN_BLUR_13_TAP];
  }

  static bloomBlendShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE3);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE4);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE5);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE6);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND], '../../../resources/wren/shaders/pass_through.vert', '../../../resources/wren/shaders/blend_bloom.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_BLOOM_BLEND];
  }

  static lineSetShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_COLOR_PER_VERTEX);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET], '../../../resources/wren/shaders/line_set.vert', '../../../resources/wren/shaders/line_set.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_LINE_SET];
  }

  static smaaEdgeDetectionShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_EDGE_DETECT_PASS]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_EDGE_DETECT_PASS] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_EDGE_DETECT_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_EDGE_DETECT_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_VIEWPORT_SIZE);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_EDGE_DETECT_PASS], '../../../resources/wren/shaders/smaa_edge_detect.vert', '../../../resources/wren/shaders/smaa_edge_detect.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_EDGE_DETECT_PASS];
  }

  static smaaBlendingWeightCalculationShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE2);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_VIEWPORT_SIZE);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS], '../../../resources/wren/shaders/smaa_blending_weights.vert', '../../../resources/wren/shaders/smaa_blending_weights.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS];
  }

  static smaaFinalBlendShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_FINAL_BLEND_PASS]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_FINAL_BLEND_PASS] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_FINAL_BLEND_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE0);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_FINAL_BLEND_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_TEXTURE1);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_FINAL_BLEND_PASS], ENUM.WR_GLSL_LAYOUT_UNIFORM_VIEWPORT_SIZE);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_FINAL_BLEND_PASS], '../../../resources/wren/shaders/smaa_final_blend.vert', '../../../resources/wren/shaders/smaa_final_blend.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_SMAA_FINAL_BLEND_PASS];
  }

  static pointSetShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_COLOR_PER_VERTEX);
      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_POINT_SIZE);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET], '../../../resources/wren/shaders/point_set.vert', '../../../resources/wren/shaders/point_set.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_POINT_SET];
  }

  static pickingShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PICKING]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PICKING] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PICKING], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PICKING], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_MATERIAL_PHONG);
      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PICKING], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PICKING], '../../../resources/wren/shaders/picking.vert', '../../../resources/wren/shaders/picking.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_PICKING];
  }

  static depthPixelShader() {
    if (!WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEPTH_PIXEL]) {
      WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEPTH_PIXEL] = _wr_shader_program_new();

      _wr_shader_program_use_uniform(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEPTH_PIXEL], ENUM.WR_GLSL_LAYOUT_UNIFORM_MODEL_TRANSFORM);

      _wr_shader_program_use_uniform_buffer(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEPTH_PIXEL], ENUM.WR_GLSL_LAYOUT_UNIFORM_BUFFER_CAMERA_TRANSFORMS);

      WbWrenShaders.buildShader(WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEPTH_PIXEL], '../../../resources/wren/shaders/web_depth.vert', '../../../resources/wren/shaders/web_depth.frag');
    }

    return WbWrenShaders.gShaders[WbWrenShaders.SHADER.SHADER_DEPTH_PIXEL];
  }
}

// gShaders static variable
WbWrenShaders.gShaders = {};

WbWrenShaders.SHADER = {
  SHADER_BLOOM_BLEND: 1,
  SHADER_BRIGHT_PASS: 2,
  SHADER_DEFAULT: 3,
  SHADER_ENCODE_DEPTH: 4,
  SHADER_FOG: 5,
  SHADER_GAUSSIAN_BLUR: 6,
  SHADER_GAUSSIAN_BLUR_13_TAP: 7,
  SHADER_GTAO: 8,
  SHADER_GTAO_SPATIAL_DENOISE: 9,
  SHADER_GTAO_TEMPORAL_DENOISE: 10,
  SHADER_GTAO_COMBINE: 11,
  SHADER_HDR_CLEAR: 12,
  SHADER_HDR_RESOLVE: 13,
  HADER_IBL_SPECULAR_IRRADIANCE_BAKE: 14,
  SHADER_IBL_BRDF_BAKE: 15,
  SHADER_LINE_SET: 16,
  SHADER_PASS_THROUGH: 17,
  SHADER_PBR: 18,
  SHADER_PBR_STENCIL_DIFFUSE_SPECULAR: 19,
  SHADER_PHONG: 20,
  SHADER_PHONG_STENCIL_AMBIENT_EMISSIVE: 21,
  SHADER_PBR_STENCIL_AMBIENT_EMISSIVE: 22,
  SHADER_PHONG_STENCIL_DIFFUSE_SPECULAR: 23,
  SHADER_PICKING: 24,
  SHADER_POINT_SET: 25,
  SHADER_SHADOW_VOLUME: 26,
  SHADER_SKYBOX: 27,
  SHADER_SMAA_EDGE_DETECT_PASS: 28,
  SHADER_SMAA_BLENDING_WEIGHT_CALCULATION_PASS: 29,
  SHADER_SMAA_FINAL_BLEND_PASS: 30,
  SHADER_DEPTH_PIXEL: 31
};

export {WbWrenShaders};
